import React, { useState } from "react";
import axios from "axios";

const GiftEmailForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gift, setGift] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    if (!name || !email || !gift) {
      setError("All fields are required.");
      return;
    }

    const prompt = `Write a personalized email to ${name} (${email}) thanking them for their gift of ${gift}. For context, I am a teacher, and these gifts are the gifts that my students have given me to thank me for the first half of the year, before we left for the holiday break. Keep the email very simple, yet sound appreciative and with holiday cheer.`;

    try {
      setLoading(true);
      const result = await axios.post("http://localhost:5001/api/generate", {
        prompt,
      });
      setResponse(result.data.message);
    } catch (err) {
      setError("Failed to generate email. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Gift Email Generator</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1em" }}>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter recipient's name"
            required
          />
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            required
          />
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>Gift: </label>
          <input
            type="text"
            value={gift}
            onChange={(e) => setGift(e.target.value)}
            placeholder="Enter the gift"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Email"}
        </button>
      </form>

      {response && (
        <div
          style={{ marginTop: "2em", padding: "1em", border: "1px solid #ccc" }}
        >
          <h2>Generated Email:</h2>
          <p>{response}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GiftEmailForm;
