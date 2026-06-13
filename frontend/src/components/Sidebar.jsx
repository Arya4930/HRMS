import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r min-h-[calc(100vh-65px)] p-4">
      <h2 className="text-lg font-bold mb-6 !text-black">Menu</h2>

      <div className="space-y-2">
        <Link
          to="/dashboard"
          className="block border rounded p-2 hover:bg-gray-100 text-black"
        >
          Dashboard
        </Link>

        <Link
          to="/employees"
          className="block border rounded p-2 hover:bg-gray-100 text-black"
        >
          Employee List
        </Link>

        <Link
          to="/add-employee"
          className="block border rounded p-2 hover:bg-gray-100 text-black"
        >
          Add Employee
        </Link>

        <Link
          to="/departments"
          className="block border rounded p-2 hover:bg-gray-100 text-black"
        >
          Departments
        </Link>

        <Link
          to="/courses"
          className="block border rounded p-2 hover:bg-gray-100 text-black"
        >
          Courses
        </Link>
      </div>
    </aside>
  );
}