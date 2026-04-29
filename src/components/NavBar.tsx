import { NavLink } from "react-router-dom";

export default function Navbar({ setActivePage }: any) {
  return (
    <div className="w-full bg-gray-900 text-white flex items-center justify-between px-6 py-3">

      <h2 className="text-xl font-bold">Menu</h2>

      <div className="flex gap-4">

        <button
          onClick={() => setActivePage("quizz")}
          className="px-4 py-2 rounded hover:bg-gray-800"
        >
          Quizz
        </button>

        <button
          onClick={() => setActivePage("lessons")}
          className="px-4 py-2 rounded hover:bg-gray-800"
        >
          Lessons
        </button>
        <NavLink
          to="/admin"
          className="px-4 py-2 rounded hover:bg-gray-800"
        >
          Admin
        </NavLink>

      </div>

    </div>
  );
}