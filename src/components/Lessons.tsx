import { useEffect, useState } from "react";
import { apiFetch } from "../middleware/apiFetcher";

type Lesson = {
  id: number;
  title: string;
  description: string;
  example?: string;
};

const API = "/api/lessons";

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [example, setExample] = useState("");

  // FETCH
  const fetchLessons = async () => {
    const res = await apiFetch(API);

    if (!res.ok) return;

    const data = await res.json();
    setLessons(data);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // DELETE
  const deleteLesson = async (id: number) => {
    await apiFetch(`${API}/${id}`, {
      method: "DELETE",
    });

    fetchLessons();
  };

  // ADD
  const addLesson = async () => {
    await apiFetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        example,
      }),
    });

    setTitle("");
    setDescription("");
    setExample("");
    setShowModal(false);
    fetchLessons();
  };

  return (
    <div className="p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <button
          onClick={() => setShowModal(true)}
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
            className="bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold">
              {lesson.title}
            </h2>
          </div>
        ))}

      </div>

      {/* DETAIL MODAL */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 flex">

          <div className="
            bg-white w-full h-full
            sm:h-auto sm:max-w-lg sm:mx-auto sm:my-10
            sm:rounded-xl
            flex flex-col
          ">

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
                onClick={() => {
                  deleteLesson(selectedLesson.id);
                  setSelectedLesson(null);
                }}
                className="text-red-500 mt-4"
              >
                Delete Lesson
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex">

          <div className="
            bg-white w-full h-full
            sm:h-auto sm:max-w-lg sm:mx-auto sm:my-10
            sm:rounded-xl
            flex flex-col
          ">

            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">New Lesson</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border p-3 rounded"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full border p-3 rounded h-32"
              />

              <input
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Example"
                className="w-full border p-3 rounded"
              />

            </div>

            <div className="p-4 border-t flex gap-2">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border p-3 rounded"
              >
                Cancel
              </button>

              <button
                onClick={addLesson}
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