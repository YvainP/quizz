import { useEffect, useState } from "react";
import { apiFetch } from "../middleware/apiFetcher";
import { useAuth } from "../store/Auth";
import CrudModal from "../components/CrudModal";
import type { FieldConfig } from "../helpers/crud";
import { Pencil, Trash2 } from "lucide-react";
import Popup from "../components/Popup";

type Lesson = {
  id: number;
  title: string;
  description: string;
  example?: string;
};

const API = "/api/lessons";

const lessonFields = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "example", label: "Example", type: "text" },
] satisfies FieldConfig<Lesson>[];

const emptyForm = {
  title: "",
  description: "",
  example: "",
};

export default function Lessons() {
  const token = useAuth((state) => state.token);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formValues, setFormValues] = useState(emptyForm);

  // ---------------- FETCH ----------------
  const fetchLessons = async () => {
    if (!token) return;

    const res = await apiFetch(API);
    if (!res.ok) return;

    const data = await res.json();
    setLessons(data);
  };

  useEffect(() => {
    fetchLessons();
  }, [token]);

  // ---------------- DELETE ----------------
const deleteLesson = async (id: number) => {
  await apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

  fetchLessons();
};

const confirmDelete = async () => {
  if (!deleteTarget) return;

  setIsDeleting(true);
  try {
    await deleteLesson(deleteTarget.id);
    setDeleteTarget(null);
  } finally {
    setIsDeleting(false);
  }
};
  // ---------------- EDIT ----------------
  const openEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);

    setFormValues({
      title: lesson.title,
      description: lesson.description,
      example: lesson.example || "",
    });

    setShowModal(true);
  };

  // ---------------- SAVE ----------------
  const saveLesson = async (data: any) => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/${editingId}` : API;

    await apiFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setShowModal(false);
    setEditingId(null);
    setFormValues(emptyForm);

    fetchLessons();
  };

  // ---------------- UI ----------------
  return (
    <div className="p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setEditingId(null);
            setFormValues(emptyForm);
            setShowModal(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Lesson
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            className="bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-lg transition flex justify-between items-start"
          >
            {/* TITLE */}
            <div className="flex-1">
              <h2 className="text-lg font-bold">{lesson.title}</h2>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(lesson);
                }}
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(lesson);
                }}
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Popup
        open={!!deleteTarget}
        message="Are you sure you want to delete this lesson?"
        loading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* DETAIL MODAL */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 flex">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-lg sm:mx-auto sm:my-10 sm:rounded-xl flex flex-col">

            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">
                {selectedLesson.title}
              </h2>

              <button onClick={() => setSelectedLesson(null)}>
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">

              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-700 mt-1">
                  {selectedLesson.description}
                </p>
              </div>

              {selectedLesson.example && (
                <div>
                  <h3 className="font-semibold">Example</h3>
                  <p className="bg-gray-100 p-3 rounded mt-1">
                    {selectedLesson.example}
                  </p>
                </div>
              )}

              <button
                onClick={() => deleteLesson(selectedLesson.id)}
                className="text-red-500 mt-4"
              >
                Delete Lesson
              </button>

            </div>
          </div>
        </div>
      )}

      {/* CRUD MODAL */}
      <CrudModal
        open={showModal}
        title={editingId ? "Edit Lesson" : "New Lesson"}
        fields={lessonFields}
        initialValues={formValues}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
        }}
        onSave={saveLesson}
      />
      
    </div>
    
  );
  
}