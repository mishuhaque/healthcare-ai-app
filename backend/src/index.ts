import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Pool } from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


app.post("/analyze-report", async (req, res) => {
  const { patientId, reportText } = req.body;

  const chat = await openai.chat.completions.create({
	  model: "gpt-4",
	  messages: [
	    {
	      role: "user",
	      content: `Classify the following patient report as 'high', 'medium', or 'low' priority:\n\n${reportText}`,
	    },
	  ],
	});

	const priority = chat.choices[0].message?.content?.toLowerCase() || "unknown";


  await pool.query(
    "INSERT INTO reports(patient_id, report_text, priority) VALUES ($1, $2, $3)",
    [patientId, reportText, priority]
  );

  res.json({ priority });
});

app.get("/reports", async (req, res) => {
  const { priority } = req.query;
  const result = await pool.query(
    priority
      ? "SELECT * FROM reports WHERE priority = $1"
      : "SELECT * FROM reports",
    priority ? [priority] : []
  );
  res.json(result.rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

