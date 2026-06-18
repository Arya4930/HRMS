import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Departments() {
  const [departments, setDepartments] = useState(
    JSON.parse(localStorage.getItem("departments")) || []
  );

  const [form, setForm] = useState({
    departmentId: "",
    departmentName: "",
    establishedDate: "",
    departmentEmail: "",
    location: "",
    budget: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setForm({
      departmentId: "",
      departmentName: "",
      establishedDate: "",
      departmentEmail: "",
      location: "",
      budget: "",
    });
  };

  const addToRecentSearches = (dept) => {
    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = [
      {
        type: "Department",
        name: dept.departmentName,
        searchedAt: new Date().toLocaleString(),
        data: dept,
      },
      ...recentSearches.filter(
        (item) =>
          !(
            item.type === "Department" &&
            item.data &&
            item.data.departmentId === dept.departmentId
          )
      ),
    ].slice(0, 10);

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedRecentSearches)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const values = Object.values(form);
    if (values.some((value) => !String(value).trim())) {
      alert("Please fill all fields");
      return;
    }

    if (editIndex !== null) {
      const updatedDepartments = [...departments];
      const updatedDepartment = {
        ...updatedDepartments[editIndex],
        ...form,
      };

      updatedDepartments[editIndex] = updatedDepartment;

      setDepartments(updatedDepartments);
      localStorage.setItem(
        "departments",
        JSON.stringify(updatedDepartments)
      );

      addToRecentSearches(updatedDepartment);
      setEditIndex(null);
    } else {
      const duplicate = departments.some(
        (dept) => dept.departmentId === form.departmentId
      );

      if (duplicate) {
        alert("Department ID already exists");
        return;
      }

      const newDepartment = {
        ...form,
        createdAt: new Date().toLocaleString(),
      };

      const updatedDepartments = [...departments, newDepartment];

      setDepartments(updatedDepartments);
      localStorage.setItem(
        "departments",
        JSON.stringify(updatedDepartments)
      );

      addToRecentSearches(newDepartment);
    }

    clearForm();
  };

  const handleEdit = (index) => {
    const dept = departments[index];

    setForm({
      departmentId: dept.departmentId,
      departmentName: dept.departmentName,
      establishedDate: dept.establishedDate,
      departmentEmail: dept.departmentEmail,
      location: dept.location,
      budget: dept.budget,
    });

    setEditIndex(index);
    addToRecentSearches(dept);
  };

  const handleDelete = (index) => {
    const deptToDelete = departments[index];

    const updatedDepartments = departments.filter((_, i) => i !== index);
    setDepartments(updatedDepartments);

    localStorage.setItem(
      "departments",
      JSON.stringify(updatedDepartments)
    );

    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = recentSearches.filter(
      (item) =>
        !(
          item.type === "Department" &&
          item.data &&
          item.data.departmentId === deptToDelete.departmentId
        )
    );

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedRecentSearches)
    );

    if (editIndex === index) {
      setEditIndex(null);
      clearForm();
    }
  };

  const handleView = (index) => {
    const dept = departments[index];
    addToRecentSearches(dept);
    alert("Added to recent searches");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold !text-black">
                Departments
              </h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Add department details below
              <br/>
              <br/>
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="departmentId"
                placeholder="Department ID"
                value={form.departmentId}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="departmentName"
                placeholder="Department Name"
                value={form.departmentName}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Established Date (DD/MM/YYYY)
                </label>
                <input
                  type="date"
                  name="establishedDate"
                  value={form.establishedDate}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-white w-full"
                />
              </div>

              <input
                type="email"
                name="departmentEmail"
                placeholder="Department Email"
                value={form.departmentEmail}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="number"
                name="budget"
                placeholder="Budget"
                value={form.budget}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  {editIndex !== null
                    ? "Update Department"
                    : "Add Department"}
                </button>
              </div>
            </form>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Established</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Location</th>
                    <th className="border p-2">Budget</th>
                    <th className="border p-2">Created At</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {departments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="border p-3 text-center">
                        No departments found
                      </td>
                    </tr>
                  ) : (
                    departments.map((dept, index) => (
                      <tr key={index}>
                        <td className="border p-2">{dept.departmentId}</td>
                        <td className="border p-2">{dept.departmentName}</td>
                        <td className="border p-2">
                          {dept.establishedDate}
                        </td>
                        <td className="border p-2">{dept.departmentEmail}</td>
                        <td className="border p-2">{dept.location}</td>
                        <td className="border p-2">₹{dept.budget}</td>
                        <td className="border p-2">{dept.createdAt}</td>
                        <td className="border p-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(index)}
                              className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            >
                              View
                            </button>

                            <button
                              onClick={() => handleEdit(index)}
                              className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(index)}
                              className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}