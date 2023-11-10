import "./App.css";
import ChatForm from "./Components/ChatFormat";
import Header from "./Components/Header";
import AnswerSec from "./Components/Answers";
import OpenAI from "openai";
import { useState } from 'react';

const App = () => {
  const [gptmessages, setMessages] = useState([]);
  const openai = new OpenAI({
    apiKey: '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',// not working: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });


  const responseGenerate = async (inputText, setInputText) => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: inputText}],
    });

    setMessages([
      {
        question: inputText,
        answer: response.choices[0].message,
      },
      ...gptmessages,
    ]);
    setInputText("");
  };
  
  return (
    <div className="App">
      <Header />
      <ChatForm responseGenerate={responseGenerate} />
      <AnswerSec gptmessages={gptmessages}/>
    </div>
  );
};

export default App;