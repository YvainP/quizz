import { useEffect, useState } from "react";

type Question = {
  id: number;
  question: string;
};

const API = "http://192.168.1.97:8000/api/questions";

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);

  // form state
  const [type, setType] = useState<"input" | "choice">("input");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt4, setOpt4] = useState("");

  // =====================
  // FETCH
  // =====================
  const fetchQuestions = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // =====================
  // DELETE
  // =====================
  const deleteQuestion = async (id: number) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchQuestions();
  };

  // =====================
  // ADD QUESTION
  // =====================
  const addQuestion = async () => {
    const payload: any = {
      question,
      type,
      answer,
      options:
        type === "choice"
          ? [opt1, opt2, opt3, opt4]
          : null,
    };

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    // reset
    setQuestion("");
    setAnswer("");
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setOpt4("");
    setShowModal(false);

    fetchQuestions();
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Questions</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Question
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {questions.map((q) => (
          <div
            key={q.id}
            className="flex justify-between border p-2 rounded"
          >
            <span>{q.question}</span>

            <button
              onClick={() => deleteQuestion(q.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-3">

            <h3 className="text-lg font-bold">New Question</h3>

            {/* TYPE */}
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "input" | "choice")
              }
              className="w-full border p-2 rounded"
            >
              <option value="input">Input</option>
              <option value="choice">Choice</option>
            </select>

            {/* QUESTION */}
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Question"
              className="w-full border p-2 rounded"
            />

            {/* ANSWER */}
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Answer"
              className="w-full border p-2 rounded"
            />

            {/* OPTIONS ONLY FOR CHOICE */}
            {type === "choice" && (
              <div className="space-y-2">
                <input
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  placeholder="Option 1"
                  className="w-full border p-2 rounded"
                />
                <input
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  placeholder="Option 2"
                  className="w-full border p-2 rounded"
                />
                <input
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  placeholder="Option 3"
                  className="w-full border p-2 rounded"
                />
                <input
                  value={opt4}
                  onChange={(e) => setOpt4(e.target.value)}
                  placeholder="Option 4"
                  className="w-full border p-2 rounded"
                />
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}