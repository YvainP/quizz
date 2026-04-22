import type { Dispatch, SetStateAction } from "react";

type Page = "lessons" | "quizz";

type SidebarProps = {
  activePage: Page;
  setActivePage: Dispatch<SetStateAction<Page>>;
};

export default function Sidebar({
  activePage,
  setActivePage,
}: SidebarProps) {
  return (
    <div className="w-full bg-gray-900 text-white flex items-center justify-between px-6 py-3">

      <h2 className="text-xl font-bold">
        Menu
      </h2>

      <div className="flex gap-4">

        <button
          onClick={() => setActivePage("quizz")}
          className={`px-4 py-2 rounded ${
            activePage === "quizz"
              ? "bg-gray-700"
              : "hover:bg-gray-800"
          }`}
        >
          Quiz
        </button>

        <button
          onClick={() => setActivePage("lessons")}
          className={`px-4 py-2 rounded ${
            activePage === "lessons"
              ? "bg-gray-700"
              : "hover:bg-gray-800"
          }`}
        >
          Lessons
        </button>

      </div>

    </div>
  );
}