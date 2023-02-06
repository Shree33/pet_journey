import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useInterval } from "../utils/use-interval";



export default function Home() {
  const [loading, setLoadingImage] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [image, setImage] = useState(null);
  const [canShowImage, setCanShowImage] = useState(false);
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyInput, setStoryInput] = useState('');
  const [petName, setPetName] = useState('');
  const [petDescription, setPetDescription] = useState('');
  const [imageStyle, setImageStyle] = useState('');

  useInterval(
    async () => {
      const res = await fetch(`/api/poll?id=${messageId}`);
      const json = await res.json();
      if (res.status === 200) {
        setLoadingImage(false);
        setImage(json.data[0].url);
      }
    },
    loading ? 10000 : null
  );

  async function callGenerateImage() {
    setLoadingImage(true);
    const prompt = `${petDescription} ${storyInput} ${imageStyle} 4k high quality illustration colof`;
    const response = await fetch(`/api/generateImage?prompt=${ prompt }`);
    const json = await response.json();
    setMessageId(json.id);
  }
  async function callGenerateEndpoint() {
    setIsGenerating(true);
    callGenerateImage();
    const prompt = `${petName} is a ${petDescription}. Today, ${petName} ${storyInput}`;
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    const { output } = data;
    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }
  function fillExample() {
    setPetName("Katsu")
    setPetDescription("a brown bunny who loves to play with yarn.");
    setStoryInput("has an adventurous time at the zoo.");
    setImageStyle("Walt Disney")
  }
  // TODO: refactor to use one function for all inputs
  function onUserChangedPetDescription(event) {
    setPetDescription(event.target.value);
  }
  function onUserChangedStory(event) {
    setStoryInput(event.target.value);
  }
  function onUserChangedName(event) {
    setPetName(event.target.value);
  }
  function onUserChangedImageStyle(event) {
    setImageStyle(event.target.value);
  }
  const showLoadingState = loading || (image && !canShowImage);

    return (
    <div className="root">
      <Head>
        <title>Pet Journey</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Create a personalized story for your furry friend </h1>
          </div>
          <div className="header-subtitle">
            <h2>Pet journey takes your prompt and builds a unique illustrated story for your pet using AI.</h2>
          </div>
        </div>
        <div className="prompt-container">
            <textarea
              className="small-prompt"
              placeholder="Please Enter Your Pet's Name."
              value={petName}
              onChange={onUserChangedName}
            />;
            <textarea
              className="prompt-box"
              placeholder="Describe your pet."
              value={petDescription}
              onChange={onUserChangedPetDescription}
            />;
            {/* TODO: Make the placeholder take in pet's name to create better prompt. */}
            <textarea
              className="prompt-box"
              placeholder= "What is their adventure today?"
              value={storyInput}
              onChange={onUserChangedStory}
            />;
            <textarea
              className="small-prompt"
              placeholder= "How do you want the image to look?"
              value={imageStyle}
              onChange={onUserChangedImageStyle}
            />;
            <div className="prompt-buttons">
              <a className='example-button' onClick={fillExample}>
                <div className="generate">
                <p>Example</p>
                  </div>
              </a>
              <a
                className={isGenerating ? 'generate-button loading' : 'generate-button'}
                onClick={callGenerateEndpoint}
              >
                <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
                </div>
              </a>
            </div>
            {apiOutput && (
              <div className="output">
                <div className="output-header-container">
                  <div className="output-header">
                    <h3>Output</h3>
                  </div>
                </div>
                <div className="output-content">
                  <p>{apiOutput}</p>
                </div>
              </div>
            )}
           <div>
             {image && (
              <div>
                <Image
                  alt={`Dall-E representation of: ${prompt}`}
                  height={256}
                  width={256}
                  src={image}
                  onLoadingComplete={() => {
                    setCanShowImage(true);
                  }}
                />
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
