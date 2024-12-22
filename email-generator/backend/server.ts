import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

// Load environment variables from .env file
dotenv.config();

// Initialize Express and OpenAI
const app = express();
const PORT = process.env.PORT || 5001;

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY, // Use the API key from .env
});

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Define an endpoint to interact with OpenAI API
app.post("/api/generate", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the OpenAI model
      messages: [
        { role: "system", content: "You are an email assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 200, // Limit the response length
      temperature: 0.7, // Control the creativity
    });

    res.json({
      message: response.choices[0].message?.content || "No content returned.",
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate email." });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is up and running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
