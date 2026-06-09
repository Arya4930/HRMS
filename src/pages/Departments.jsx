import { useState } from "react";

export default function Departments() {
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    department_id: "",
    department_name: "",
    department_head: "",
    department_email: "",
    location: "",
    budget: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setDepartments([...departments, form]);

    setForm({
      department_id: "",
      department_name: "",
      department_head: "",
      department_email: "",
      location: "",
      budget: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-5 !text-black">
        Departments
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >
        <input
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          placeholder="Department ID"
          className="border p-2 rounded"
        />

        <input
          name="department_name"
          value={form.department_name}
          onChange={handleChange}
          placeholder="Department Name"
          className="border p-2 rounded"
        />

        <input
          name="department_head"
          value={form.department_head}
          onChange={handleChange}
          placeholder="Department Head"
          className="border p-2 rounded"
        />

        <input
          name="department_email"
          value={form.department_email}
          onChange={handleChange}
          placeholder="Department Email"
          className="border p-2 rounded"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 rounded"
        />

        <input
          name="budget"
          value={form.budget}
          onChange={handleChange}
          placeholder="Budget"
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white rounded p-2"
        >
          Save Department
        </button>
      </form>

      <table className="w-full border mt-6">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Head</th>
            <th className="border p-2">Location</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept, index) => (
            <tr key={index}>
              <td className="border p-2">{dept.department_id}</td>
              <td className="border p-2">{dept.department_name}</td>
              <td className="border p-2">{dept.department_head}</td>
              <td className="border p-2">{dept.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}