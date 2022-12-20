import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix =
`
Write me a detailed narrative for a story with the premise below.

Title:
`



const generateAction = async (req, res) => {
  console.log('req.body', req.body);
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.87,
    max_tokens: 700,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();


  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;