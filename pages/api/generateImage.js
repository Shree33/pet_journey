const QSTASH = `https://qstash.upstash.io/v1/publish/`;
const DALL_E = "https://api.openai.com/v1/images/generations";
// const VERCEL_URL = "pet-journey.vercel.app";
import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const imagePromptPrefix = 
`
Take the narrative below and generate 1 image prompt that highlight the story's key moments. Emphasize details about the main character.

Narrative:

`

export default async function handler(req,res) {
  const { prompt }  = req.query;
  // const imagePromptCompletion = await openai.createCompletion({
  //   model: 'text-davinci-003',
  //   prompt: `${imagePromptPrefix}${userInput}`,
  //   temperature: 0.87,
  //   max_tokens: 700,
  // });
  // console.log('userInput', req.query)
  // const imagePrompt = imagePromptCompletion.data.choices.pop();
  
  // const { prompt } = imagePrompt.text;
  try {
    const response = await fetch(`${QSTASH}${DALL_E}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Upstash-Forward-Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "Upstash-Callback": `https://pet-journey.vercel.app/api/callback`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512",
      }),
    });
    const json = await response.json();
    return res.status(202).json({ id: json.messageId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}
