import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { apiFetch } from "../middleware/apiFetcher";

type Question = {
  id: number;
  question: string;
  type: "input" | "choice";
  answer: string;
  kana_kanji?: string;
  options?: string[];
};

const API = "/api/questions";

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [type, setType] = useState<"input" | "choice">("input");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [kanaKanji, setKanaKanji] = useState("");

  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt4, setOpt4] = useState("");

  const fetchQuestions = async () => {
    const res = await apiFetch(API);
    if (!res.ok) return;

    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setType("input");
    setQuestion("");
    setAnswer("");
    setKanaKanji("");
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setOpt4("");
  };

  const deleteQuestion = async (id: number) => {
    await apiFetch(`${API}/${id}`, {
      method: "DELETE",
    });

    fetchQuestions();
  };

  const openEdit = (q: Question) => {
    setEditingId(q.id);
    setType(q.type);
    setQuestion(q.question);
    setAnswer(q.answer);
    setKanaKanji(q.kana_kanji || "");

    if (q.options) {
      setOpt1(q.options[0] || "");
      setOpt2(q.options[1] || "");
      setOpt3(q.options[2] || "");
      setOpt4(q.options[3] || "");
    }

    setShowModal(true);
  };

  const saveQuestion = async () => {
    const payload = {
      question,
      type,
      answer,
      kana_kanji: kanaKanji,
      options:
        type === "choice"
          ? [opt1, opt2, opt3, opt4].filter(Boolean)
          : null,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    await apiFetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    resetForm();
    setShowModal(false);
    fetchQuestions();
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold">
          Manage Questions
        </h2>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 sm:px-4 rounded"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {questions.map((q) => (
          <div
            key={q.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div className="truncate">
              <div>{q.question}</div>
              <div className="text-xs text-gray-500">
                {q.kana_kanji ?? "-"}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(q)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => deleteQuestion(q.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex">
          <div className="bg-white w-full h-full sm:mx-auto sm:my-10 sm:h-auto sm:max-w-lg sm:rounded-xl flex flex-col">

            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">
                {editingId ? "Edit Question" : "New Question"}
              </h3>

              <button onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "input" | "choice")
                }
                className="w-full border p-3 rounded"
              >
                <option value="input">Input</option>
                <option value="choice">Choice</option>
              </select>

              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question"
                className="w-full border p-3 rounded"
              />

              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Answer"
                className="w-full border p-3 rounded"
              />

              <input
                value={kanaKanji}
                onChange={(e) => setKanaKanji(e.target.value)}
                placeholder="Kana / Kanji"
                className="w-full border p-3 rounded"
              />

              {type === "choice" && (
                <div className="space-y-2">
                  {[opt1, opt2, opt3, opt4].map((val, i) => (
                    <input
                      key={i}
                      value={val}
                      onChange={(e) => {
                        const setters = [
                          setOpt1,
                          setOpt2,
                          setOpt3,
                          setOpt4,
                        ];
                        setters[i](e.target.value);
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="w-full border p-3 rounded"
                    />
                  ))}
                </div>
              )}

            </div>

            <div className="p-4 border-t flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border p-3 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveQuestion}
                className="flex-1 bg-blue-500 text-white p-3 rounded"
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