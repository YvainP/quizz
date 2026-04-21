import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Quizz from "../components/Quizz";
import Lessons from "../components/Lessons";
import QuestionManager from "../components/QuestionManager";

export default function Home() {
  const [activePage, setActivePage] =
    useState<"lessons" | "quizz">("quizz");

  const [showManager, setShowManager] = useState(false);

  return (
    <div className="flex min-h-screen">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-blue-600">
            {activePage === "quizz" ? "Quizz" : "Lessons"}
          </h1>

          {activePage === "quizz" && (
            <button
              onClick={() => setShowManager(!showManager)}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              {showManager ? "Back to Quizz" : "Manage Questions"}
            </button>
          )}

        </div>

        {/* CONTENT SWITCH */}
        {activePage === "quizz" && (
          <>
            {showManager ? <QuestionManager /> : <Quizz />}
          </>
        )}

        {activePage === "lessons" && <Lessons />}

      </div>

    </div>
  );
}