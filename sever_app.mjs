import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const app = express();
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  try {
    let content = await main();
    res.send(content);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening on port ${port}`));

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: "You are a helpful assistant." }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`Failed to get completion from OpenAI: ${error.message}`);
  }
}
