import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:5000/analyze-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: "test123", reportText: text }),
    });
    const data = await res.json();
    setResult(data.priority);
  };

  return (
    <div>
      <h1>Upload Medical Report</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={submit}>Analyze</button>
      <p>Priority: {result}</p>
    </div>
  );
}

export default App;

