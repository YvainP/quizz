import { useEffect, useState } from "react";
import { questions, type Question } from "../data/questions";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] =
    useState<Question | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");

  function pickRandomQuestion(): Question {
    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
  }

  useEffect(() => {
    setCurrentQuestion(pickRandomQuestion());
  }, []);

  function loadNextQuestion() {
    setTimeout(() => {
      setFeedback("");
      setInputValue("");
      setCurrentQuestion(pickRandomQuestion());
    }, 3000);
  }

  function checkAnswer(userAnswer: string) {
    if (!currentQuestion) return;

    const correct =
      userAnswer.trim().toLowerCase() ===
      currentQuestion.answer.toLowerCase();

    if (correct) {
      setFeedback("Correct ✅");
    } else {
      setFeedback(`Wrong ❌ (answer: ${currentQuestion.answer})`);
    }

    loadNextQuestion();
  }

  if (!currentQuestion) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading question...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
      
      {/* Question */}
      <h2 className="text-xl font-semibold text-gray-800">
        {currentQuestion.question}
      </h2>

      {/* INPUT MODE */}
      {currentQuestion.type === "input" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkAnswer(inputValue);
          }}
          className="space-y-3"
        >
          <input
            type="text"
            placeholder="Type your answer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Submit
          </button>
        </form>
      )}

      {/* MULTIPLE CHOICE MODE */}
      {currentQuestion.type === "choice" && (
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => checkAnswer(option)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* FEEDBACK */}
      {feedback && (
        <p className="text-center font-medium text-gray-700">
          {feedback}
        </p>
      )}
    </div>
  );
}