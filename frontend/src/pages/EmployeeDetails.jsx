import { useState } from "react";

export default function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    salary: "",
    job_title: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmployees([...employees, form]);

    setForm({
      employee_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      salary: "",
      job_title: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h1 className="text-2xl font-bold mb-5 !text-black">
        Employee Details
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >

        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          placeholder="Employee ID"
          className="border p-2 rounded"
        />

        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="border p-2 rounded"
        />

        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="border p-2 rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded"
        />

        <input
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-2 rounded"
        />

        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="border p-2 rounded"
        />

        <input
          name="job_title"
          value={form.job_title}
          onChange={handleChange}
          placeholder="Job Title"
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2"
        >
          Save Employee
        </button>

      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">
          Employee Records
        </h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Salary</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, index) => (
              <tr key={index}>
                <td className="border p-2">{emp.employee_id}</td>
                <td className="border p-2">
                  {emp.first_name} {emp.last_name}
                </td>
                <td className="border p-2">{emp.email}</td>
                <td className="border p-2">{emp.phone_number}</td>
                <td className="border p-2">{emp.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}