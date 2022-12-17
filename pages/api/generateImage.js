import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const generateImage = async (req, res) => {
  console.log(`API: ${req.body.userInput}`)
  const response = await openai.createImage({
  prompt:`${req.body.userInput}`,
  n: 1,
  size: "512x512",
  response_format: "b64_jason"
});
image_url = response.data.data[0].url;
res.status(200).json({ output: image_url });
}

export default generateImage;