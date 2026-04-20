import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Quiz from "../components/Quiz";
import Lessons from "../components/Lessons";

export default function Home() {
  const [activePage, setActivePage] =
    useState<"lessons" | "quiz">("lessons");

  return (
    <div className="flex min-h-screen">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 p-8">
        {activePage === "quiz" && (
          <>
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
              Quiz
            </h1>

            <Quiz />
          </>
        )}

        {activePage === "lessons" && <Lessons />}
      </div>

    </div>
  );
}