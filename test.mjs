import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

const app = express();
app.use(bodyParser.json());


app.get('/', async (req, res) => {
    try {
      let content = await runPrompt();
      res.send(content);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  });


  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`Listening on port ${port}`));
const runPrompt = async () => {
    const messages = [
        {
            role: "system",
            content: "You are a helpful assistant."
        },
        {
            role: "user",
            content: `Write me a joke about a cat and a bowl of pasta. Return response in the following parsable JSON format:

            {
                "Q": "question",
                "A": "answer"
            }`
        }
    ];

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages,
            max_tokens: 2048,
            temperature: 1,
        });

        const parsableJSONresponse = response.choices[0].message.content.trim();
        const parsedResponse = JSON.parse(parsableJSONresponse);

        return(`Question: ${parsedResponse.Q}\nAnswer: ${parsedResponse.A}\n\nQuestion: parsedResponse.Q`);
        // console.log("Answer: ", parsedResponse.A);
    } catch (error) {
        console.error("Error: ", error.message);
    }
};

runPrompt();