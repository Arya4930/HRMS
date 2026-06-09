import { useState } from "react";

export default function EmployeeCourses() {
  const [enrollments, setEnrollments] = useState([]);

  const [form, setForm] = useState({
    enrollment_id: "",
    employee_id: "",
    course_id: "",
    enrollment_date: "",
    completion_status: "Not Started",
    completion_date: "",
    score: "",
    certificate_issued: "No",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setEnrollments([...enrollments, form]);

    setForm({
      enrollment_id: "",
      employee_id: "",
      course_id: "",
      enrollment_date: "",
      completion_status: "Not Started",
      completion_date: "",
      score: "",
      certificate_issued: "No",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-5 !text-black">
        Employee Course Enrollment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >
        <input
          name="enrollment_id"
          value={form.enrollment_id}
          onChange={handleChange}
          placeholder="Enrollment ID"
          className="border p-2 rounded"
        />

        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          placeholder="Employee ID"
          className="border p-2 rounded"
        />

        <input
          name="course_id"
          value={form.course_id}
          onChange={handleChange}
          placeholder="Course ID"
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="enrollment_date"
          value={form.enrollment_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="completion_status"
          value={form.completion_status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <input
          type="date"
          name="completion_date"
          value={form.completion_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="score"
          value={form.score}
          onChange={handleChange}
          placeholder="Score"
          className="border p-2 rounded"
        />

        <select
          name="certificate_issued"
          value={form.certificate_issued}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <button
          type="submit"
          className="bg-orange-600 text-white rounded p-2"
        >
          Save Enrollment
        </button>
      </form>

      <table className="w-full border mt-6">
        <thead>
          <tr>
            <th className="border p-2">Enrollment</th>
            <th className="border p-2">Employee</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.enrollment_id}</td>
              <td className="border p-2">{item.employee_id}</td>
              <td className="border p-2">{item.course_id}</td>
              <td className="border p-2">{item.completion_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}