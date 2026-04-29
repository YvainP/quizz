import { useEffect, useState } from "react";
import { apiFetch } from "../middleware/apiFetcher";
import { useAuth } from "../store/Auth";

type Lesson = {
  id: number;
  title: string;
  description: string;
  example?: string;
};

const API = "/api/lessons";

export default function Lessons() {
  const token = useAuth((state) => state.token);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // ---------------- FETCH ----------------
  const fetchLessons = async () => {
    if (!token) return;

    const res = await apiFetch(API);
    if (!res.ok) return;

    const data = await res.json();
    setLessons(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchLessons();
  }, [token]);

  // ---------------- UI ----------------
  return (
    <div className="p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Lessons</h1>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            className="bg-white shadow rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold">{lesson.title}</h2>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-xl flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">
                {selectedLesson.title}
              </h2>

              <button
                onClick={() => setSelectedLesson(null)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-4">

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

            </div>

          </div>

        </div>
      )}

    </div>
  );
}