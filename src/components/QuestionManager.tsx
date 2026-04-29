import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { apiFetch } from "../middleware/apiFetcher";
import { useAuth } from "../store/Auth";
import Popup from "../components/Popup";
import CrudModal from "../components/CrudModal";
import type { FieldConfig } from "../helpers/crud";

type Question = {
  id: number;
  question: string;
  type: "input" | "choice";
  answer: string;
  kana_kanji?: string;
  options?: string[];
};

const API = "/api/questions";

const questionFields = [
  {
    name: "type",
    label: "Type",
    type: "select",
    options: ["input", "choice"],
  },
  { name: "question", label: "Question", type: "text" },
  { name: "answer", label: "Answer", type: "text" },
  { name: "kana_kanji", label: "Kana / Kanji", type: "text" },
] satisfies FieldConfig<Question>[];

const emptyForm = {
  type: "input",
  question: "",
  answer: "",
  kana_kanji: "",
};

export default function QuestionManager() {
  const token = useAuth((state) => state.token);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formValues, setFormValues] = useState(emptyForm);

  // ---------------- FETCH ----------------
  const fetchQuestions = async () => {
    if (!token) return;

    const res = await apiFetch(API);
    if (!res.ok) return;

    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, [token]);

  // ---------------- DELETE ----------------
  const deleteQuestion = async (id: number) => {
    await apiFetch(`${API}/${id}`, { method: "DELETE" });
    fetchQuestions();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteQuestion(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------------- EDIT ----------------
  const openEdit = (q: Question) => {
    setEditingId(q.id);

    setFormValues({
      type: q.type,
      question: q.question,
      answer: q.answer,
      kana_kanji: q.kana_kanji || "",
    });

    setShowModal(true);
  };

  // ---------------- SAVE ----------------
  const saveQuestion = async (data: any) => {
    const payload = {
      ...data,
      options: data.type === "choice" ? [] : null,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    await apiFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setShowModal(false);
    setEditingId(null);
    setFormValues(emptyForm);

    fetchQuestions();
  };

  // ---------------- UI ----------------
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold">Manage Questions</h2>

        <button
          onClick={() => {
            setEditingId(null);
            setFormValues(emptyForm);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded"
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
              <button onClick={() => openEdit(q)}>
                <Pencil size={18} />
              </button>

              <button onClick={() => setDeleteTarget(q)}>
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CrudModal
        open={showModal}
        title={editingId ? "Edit Question" : "New Question"}
        fields={questionFields}
        initialValues={formValues}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
        }}
        onSave={saveQuestion}
      />

      {/* DELETE POPUP */}
      <Popup
        open={!!deleteTarget}
        message="Are you sure you want to delete this question?"
        loading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}