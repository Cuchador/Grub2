import { useState } from "react";

const ChatForm = ({ responseGenerate }) => {
  const [inputText, setInputText] = useState("");

  return (
    <div className="formDiv">
      <textarea
        rows="10"
        className="formControl"
        placeholder="What food are you feeling today?"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <br />
      <button
        onClick={() => responseGenerate(inputText, setInputText)}
        className="formBtn"
      >
        Generate Response
      </button>
    </div>
  );
};

export default ChatForm;