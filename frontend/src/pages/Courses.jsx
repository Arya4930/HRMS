import { useState } from "react";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    course_id: "",
    course_name: "",
    source: "",
    duration_days: "",
    course_type: "",
    created_by: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setCourses([...courses, form]);

    setForm({
      course_id: "",
      course_name: "",
      source: "",
      duration_days: "",
      course_type: "",
      created_by: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-5 !text-black">
        Courses
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >
        <input
          name="course_id"
          value={form.course_id}
          onChange={handleChange}
          placeholder="Course ID"
          className="border p-2 rounded"
        />

        <input
          name="course_name"
          value={form.course_name}
          onChange={handleChange}
          placeholder="Course Name"
          className="border p-2 rounded"
        />

        <input
          name="source"
          value={form.source}
          onChange={handleChange}
          placeholder="Source"
          className="border p-2 rounded"
        />

        <input
          name="duration_days"
          value={form.duration_days}
          onChange={handleChange}
          placeholder="Duration Days"
          className="border p-2 rounded"
        />

        <input
          name="course_type"
          value={form.course_type}
          onChange={handleChange}
          placeholder="Course Type"
          className="border p-2 rounded"
        />

        <input
          name="created_by"
          value={form.created_by}
          onChange={handleChange}
          placeholder="Created By"
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-purple-600 text-white rounded p-2"
        >
          Save Course
        </button>
      </form>

      <table className="w-full border mt-6">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Source</th>
            <th className="border p-2">Duration</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td className="border p-2">{course.course_id}</td>
              <td className="border p-2">{course.course_name}</td>
              <td className="border p-2">{course.source}</td>
              <td className="border p-2">{course.duration_days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}