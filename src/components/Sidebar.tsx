import type { Dispatch, SetStateAction } from "react";

type SidebarProps = {
  activePage: "lessons" | "quiz";
  setActivePage: Dispatch<SetStateAction<"lessons" | "quiz">>;
};

export default function Sidebar({
  activePage,
  setActivePage,
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
      <h2 className="text-xl font-bold">Menu</h2>
        <button
        onClick={() => setActivePage("quiz")}
        className={`text-left px-4 py-2 rounded transition ${
            activePage === "quiz"
            ? "bg-gray-700"
            : "hover:bg-gray-800"
        }`}
        >
        Quiz
        </button>
        <button
            onClick={() => setActivePage("lessons")}
            className={`text-left px-4 py-2 rounded transition ${
            activePage === "lessons"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
        >
            Lessons
        </button>
    </div>
  );
}