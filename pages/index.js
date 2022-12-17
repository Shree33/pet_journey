import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useInterval } from "../utils/use-interval";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [image, setImage] = useState(null);
  const [canShowImage, setCanShowImage] = useState(false);

  useInterval(
    async () => {
      const res = await fetch(`/api/poll?id=${messageId}`);
      const json = await res.json();
      if (res.status === 200) {
        setLoading(false);
        setImage(json.data[0].url);
      }
    },
    loading ? 1000 : null
  );

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/generateImage?prompt=${prompt}`);
    const json = await response.json();
    setMessageId(json.id);
  }

  const showLoadingState = loading || (image && !canShowImage);
  return (
    <>
      <Head>
        <title>Pet Journey</title>
      </Head>
      <div>
        <div>
          <form
            onSubmit={submitForm}
          >
            <input
              type="text"
              placeholder="Prompt for DALL-E"
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              type="submit"
            >
              {showLoadingState && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {!showLoadingState ? "Generate" : ""}
            </button>
          </form>
          <div>
            {image && (
              <div>
                <Image
                  alt={`Dall-E representation of: ${prompt}`}
                  src={image}
                  fill={true}
                  onLoadingComplete={() => {
                    setCanShowImage(true);
                  }}
                />
              </div>
            )}
            </div>
          </div>
        </div>
    </>
  );
}
// export default function Home () {
//   const [userInput, setUserInput] = useState('');
//   const [apiOutput, setApiOutput] = useState('')
//   const [isGenerating, setIsGenerating] = useState(false)

//   const callGenerateEndpoint = async () => {
//     setIsGenerating(true);
    
//     console.log("Calling OpenAI...")
//     const response = await fetch('/api/generate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ userInput }),
//     });

//     const data = await response.json();
//     const { output } = data;
//     setApiOutput(`${output.text}`);
//     setIsGenerating(false);
//   }
//   const callImageEndpoint = async () => {
//     setIsGenerating(true);

//     console.log("Calling OpenAI...")
//     const response = await fetch('/api/generateImage', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ userInput }),
//     });

//     const data = await response.json();
//     const { output } = data;
//     setApiOutput(`${output}`);
//     setIsGenerating(false);
//   }
//   const onUserChangedText = (event) => {
//     setUserInput(event.target.value);
//   };
//   return (
//     <div className="root">
//       <Head>
//         <title>GPT-3 Writer | buildspace</title>
//       </Head>
//       <div className="container">
//         <div className="header">
//           <div className="header-title">
//             <h1>Personalize Pet Journeys </h1>
//           </div>
//           <div className="header-subtitle">
//             <h2>Create custom, illustrated pet journeys for your furry friends.</h2>
//           </div>
//         </div>
//         <div className="prompt-container">
//             <textarea
//               className="prompt-box"
//               placeholder="start typing here"
//               value={userInput}
//               onChange={onUserChangedText}
//             />;
//             <div className="prompt-buttons">
//               <a
//                 className={isGenerating ? 'generate-button loading' : 'generate-button'}
//                 onClick={callGenerateEndpoint}
//               >
//                 <div className="generate">
//                 {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
//                 </div>
//               </a>
//             </div>
//             {apiOutput && (
//               <div className="output">
//                 <div className="output-header-container">
//                   <div className="output-header">
//                     <h3>Output</h3>
//                   </div>
//                 </div>
//                 <div className="output-content">
//                   <p>{apiOutput}</p>
//                 </div>
//               </div>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// };


