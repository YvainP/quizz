import { useEffect, useState } from "react";
import { useAuth } from "../store/Auth";

type Question = {
  id: number;
  question: string;
  type: "input" | "choice";
  answer: string;
  kana_kanji?: string;
  options?: string[];
};

export default function Quizz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(false);
  const token = useAuth((state) => state.token);

  function shuffle(list: Question[]) {
    return [...list].sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    if (!token) return;

    fetch("/api/questions", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        const shuffled = shuffle(data);

        setQuestions(data);
        setRemainingQuestions(shuffled.slice(1));
        setCurrentQuestion(shuffled[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token]); // 🔥 IMPORTANT

  function checkAnswer(userAnswer: string) {
    if (!currentQuestion || answered) return;

    const correct =
      userAnswer.trim().toLowerCase() ===
      currentQuestion.answer.toLowerCase();

    if (correct) {
      setFeedback("✅ ");
    } else {
      setFeedback(`❌ : ${currentQuestion.answer}`);
    }
    setAnswered(true);
  }

  function nextQuestion() {
    if (!answered) return;

    let pool = remainingQuestions;

    if (pool.length <= 1) {
      pool = shuffle(questions);
    }

    const next = pool[0];

    setRemainingQuestions(pool.slice(1));
    setCurrentQuestion(next);

    setInputValue("");
    setFeedback("");
    setAnswered(false);
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

      {/* QUESTION */}
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
            disabled={answered}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Type your answer..."
          />

          <button
            disabled={answered}
            className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
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
              disabled={answered}
              onClick={() => checkAnswer(option)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* FEEDBACK */}
      {feedback && (
        <p className="text-center font-medium">
          {feedback}

          {currentQuestion.kana_kanji && (
            <span className="block text-sm text-gray-500 mt-1">
              ({currentQuestion.kana_kanji})
            </span>
          )}
        </p>
      )}

      {/* PASS */}
      {answered && (
        <div className="flex justify-end">
          <button
            onClick={nextQuestion}
            className="w-4/12 bg-gray-200 py-1 text-sm rounded-lg"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}