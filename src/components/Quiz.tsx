import { useEffect, useState } from "react";

type Question = {
  id: number;
  question: string;
  type: "input" | "choice";
  answer: string;
  options?: string[];
};

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");

  // 🔥 Fetch questions from Laravel API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);

        // pick first random question
        const index = Math.floor(Math.random() * data.length);
        setCurrentQuestion(data[index]);
      })
      .catch((err) => console.error(err));
  }, []);

  function pickRandomQuestion(list: Question[]) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  function loadNextQuestion() {
    setTimeout(() => {
      setFeedback("");
      setInputValue("");

      if (questions.length > 0) {
        setCurrentQuestion(pickRandomQuestion(questions));
      }
    }, 5000);
  }

  function checkAnswer(userAnswer: string) {
    if (!currentQuestion) return;

    const correct =
      userAnswer.trim().toLowerCase() ===
      currentQuestion.answer.toLowerCase();

    if (correct) {
      setFeedback("Correct ✅");
    } else {
      setFeedback(`❌ (answer: ${currentQuestion.answer})`);
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Type your answer..."
          />

          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Submit
          </button>
        </form>
      )}

      {/* CHOICE MODE */}
      {currentQuestion.type === "choice" && (
        <div className="flex flex-col gap-3">
          {currentQuestion.options?.map((option) => (
            <button
              key={option}
              onClick={() => checkAnswer(option)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {feedback && (
        <p className="text-center font-medium">{feedback}</p>
      )}
    </div>
  );
}