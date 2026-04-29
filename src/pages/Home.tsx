import { useState } from "react";
import Navbar from "../components/NavBar";
import Quizz from "../components/Quizz";
import Lessons from "../components/Lessons";

export default function Home() {
  const [activePage, setActivePage] = useState<"lessons" | "quizz">("quizz");

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar setActivePage={setActivePage} />

      <main className="flex-1 p-8">

        {activePage === "quizz" && <Quizz />}
        {activePage === "lessons" && <Lessons />}

      </main>

    </div>
  );
}