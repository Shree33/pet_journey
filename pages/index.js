import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useInterval } from "../utils/use-interval";

export default function Home() {
  const [loading, setLoadingImage] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [image, setImage] = useState(null);
  const [canShowImage, setCanShowImage] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

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
    const response = await fetch(`/api/generateImage?prompt=${ userInput }`);
    const json = await response.json();
    setMessageId(json.id);
  }
  async function callGenerateEndpoint() {
    setIsGenerating(true);
    callGenerateImage();
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }
  function fillExample() {
    setUserInput("Katsu, the male bunny, has an adventurous time at the zoo.");
  }
  function onUserChangedText(event) {
    setUserInput(event.target.value);
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
              className="prompt-box"
              placeholder="start typing here"
              value={userInput}
              onChange={onUserChangedText}
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
  // return (
  //   <>
  //     <div>
  //       <div>
  //         <form
  //           onSubmit={submitForm}
  //         >
  //           <input
  //             type="text"
  //             placeholder="Prompt for DALL-E"
  //             onChange={(e) => setPrompt(e.target.value)}
  //           />
  //           <button
  //             type="submit"
  //           >
  //             {showLoadingState && (
  //               <svg
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 fill="none"
  //                 viewBox="0 0 24 24"
  //               >
  //                 <circle
  //                   cx="12"
  //                   cy="12"
  //                   r="10"
  //                   stroke="currentColor"
  //                   strokeWidth="4"
  //                 ></circle>
  //                 <path
  //                   fill="currentColor"
  //                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  //                 ></path>
  //               </svg>
  //             )}
  //             {!showLoadingState ? "Generate" : ""}
  //           </button>
  //         </form>
  //         <div>
  //           {image && (
  //             <div>
  //               <Image
  //                 alt={`Dall-E representation of: ${prompt}`}
  //                 src={image}
  //                 fill={true}
  //                 onLoadingComplete={() => {
  //                   setCanShowImage(true);
  //                 }}
  //               />
  //             </div>
  //           )}
  //           </div>
  //         </div>
  //       </div>
  //   </>
  // );
}
