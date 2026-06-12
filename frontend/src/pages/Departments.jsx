import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Departments() {
  const [departments, setDepartments] = useState(
    JSON.parse(localStorage.getItem("departments")) || []
  );
  const [departmentName, setDepartmentName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!departmentName.trim()) return;

    const updatedDepartments = [...departments, departmentName];
    setDepartments(updatedDepartments);
    localStorage.setItem("departments", JSON.stringify(updatedDepartments));
    setDepartmentName("");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold !text-black">Departments</h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Add department names below
              <br/>
              <br/>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Enter Department Name"
                className="flex-1 border rounded px-3 py-2 bg-white"
              />
              <button
                type="submit"
                className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              >
                Add
              </button>
            </form>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3 !text-black">
                Saved Departments
              </h2>

              {departments.length === 0 ? (
                <p className="text-gray-600">No departments added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {departments.map((dept, index) => (
                    <li key={index} className="border rounded p-3 bg-gray-50">
                      {dept}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}