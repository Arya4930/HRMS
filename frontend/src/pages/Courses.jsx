import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Courses() {
  const [courses, setCourses] = useState(
    JSON.parse(localStorage.getItem("courses")) || []
  );

  const [form, setForm] = useState({
    courseId: "",
    courseName: "",
    courseCode: "",
    courseLocation: "",
    durationDays: "",
    courseDetails: "",
    instructorName: "",
    cost: "",
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
      courseId: "",
      courseName: "",
      courseCode: "",
      courseLocation: "",
      durationDays: "",
      courseDetails: "",
      instructorName: "",
      cost: "",
    });
  };

  const addToRecentSearches = (course) => {
    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = [
      {
        type: "Course",
        name: course.courseName,
        code: course.courseCode,
        searchedAt: new Date().toLocaleString(),
        data: course,
      },
      ...recentSearches.filter(
        (item) =>
          !(
            item.type === "Course" &&
            item.data &&
            item.data.courseId === course.courseId
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
      const updatedCourses = [...courses];
      const updatedCourse = {
        ...updatedCourses[editIndex],
        ...form,
        createdAt: updatedCourses[editIndex].createdAt,
      };

      updatedCourses[editIndex] = updatedCourse;

      setCourses(updatedCourses);
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      addToRecentSearches(updatedCourse);
      setEditIndex(null);
    } else {
      const newCourse = {
        ...form,
        createdAt: new Date().toLocaleString(),
      };

      const updatedCourses = [...courses, newCourse];

      setCourses(updatedCourses);
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      addToRecentSearches(newCourse);
    }

    clearForm();
  };

  const handleEdit = (index) => {
    const course = courses[index];

    setForm({
      courseId: course.courseId,
      courseName: course.courseName,
      courseCode: course.courseCode,
      courseLocation: course.courseLocation,
      durationDays: course.durationDays,
      courseDetails: course.courseDetails,
      instructorName: course.instructorName,
      cost: course.cost,
    });

    setEditIndex(index);
    addToRecentSearches(course);
  };

  const handleDelete = (index) => {
    const courseToDelete = courses[index];

    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));

    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = recentSearches.filter(
      (item) =>
        !(
          item.type === "Course" &&
          item.data &&
          item.data.courseId === courseToDelete.courseId
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
    const course = courses[index];
    addToRecentSearches(course);
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
              <h1 className="text-2xl font-bold !text-black">Courses</h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Add course details below
              <br/>
              <br/>
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="courseId"
                placeholder="Course ID"
                value={form.courseId}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="courseName"
                placeholder="Course Name"
                value={form.courseName}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="courseCode"
                placeholder="Course Code"
                value={form.courseCode}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="courseLocation"
                placeholder="Course Location"
                value={form.courseLocation}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="number"
                name="durationDays"
                placeholder="Duration (Days)"
                value={form.durationDays}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="instructorName"
                placeholder="Instructor Name"
                value={form.instructorName}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="number"
                name="cost"
                placeholder="Course Cost"
                value={form.cost}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <textarea
                name="courseDetails"
                placeholder="Course Details"
                value={form.courseDetails}
                onChange={handleChange}
                className="border rounded px-3 py-2 md:col-span-2 bg-white"
                rows="4"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  {editIndex !== null ? "Update Course" : "Add Course"}
                </button>
              </div>
            </form>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Course</th>
                    <th className="border p-2">Code</th>
                    <th className="border p-2">Location</th>
                    <th className="border p-2">Duration</th>
                    <th className="border p-2">Details</th>
                    <th className="border p-2">Instructor</th>
                    <th className="border p-2">Cost</th>
                    <th className="border p-2">Created At</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="border p-3 text-center">
                        No courses found
                      </td>
                    </tr>
                  ) : (
                    courses.map((course, index) => (
                      <tr key={index}>
                        <td className="border p-2">{course.courseId}</td>
                        <td className="border p-2">{course.courseName}</td>
                        <td className="border p-2">{course.courseCode}</td>
                        <td className="border p-2">{course.courseLocation}</td>
                        <td className="border p-2">{course.durationDays} Days</td>
                        <td className="border p-2">{course.courseDetails}</td>
                        <td className="border p-2">{course.instructorName}</td>
                        <td className="border p-2">₹{course.cost}</td>
                        <td className="border p-2">{course.createdAt}</td>
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
