import React from "react";

const AnswerSec = ({ gptmessages }) => {
  return (
    <div className="answerDiv">
      <div className="answerSubDiv">
        <hr className="hrLine" />
        <div className="answerContainer">
            {gptmessages.map((value, index) => {
                return (
                <div className="answerSection" key={index}>
                    <p className="question">{value.question}</p>
                    <p className="answer">{value.answer.content}</p>
                </div>
                )
            })}
        </div>
        </div>
      </div>
  );
};

export default AnswerSec;