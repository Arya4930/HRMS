import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [form, setForm] = useState({
    courseid: "",
    coursename: "",
    coursecode: "",
    courselocation: "",
    durationdays: "",
    coursedetails: "",
    instructorname: "",
    cost: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/course`);
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        alert(error.message || "An error occurred while fetching the courses");
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setForm({
      courseid: "",
      coursename: "",
      coursecode: "",
      courselocation: "",
      durationdays: "",
      coursedetails: "",
      instructorname: "",
      cost: "",
    });
  };

  const addToRecentSearches = (course) => {
    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = [
      {
        type: "Course",
        name: course.coursename,
        code: course.coursecode,
        searchedAt: new Date().toLocaleString(),
        data: course,
      },
      ...recentSearches.filter(
        (item) =>
          !(
            item.type === "Course" &&
            item.data &&
            item.data.courseid === course.courseid
          )
      ),
    ].slice(0, 10);

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedRecentSearches)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = Object.values(form);
    if (values.some((value) => !String(value).trim())) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editIndex !== null) {
        const res = await fetch(`${API_BASE}/course/${courses[editIndex].courseid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        if(!res.ok) {
          throw new Error("Failed to update course");
        }
        const updatedCourses = [...courses];
        const updatedCourse = {
          ...updatedCourses[editIndex],
          ...form,
          createdat: updatedCourses[editIndex].createdat,
        };

        updatedCourses[editIndex] = updatedCourse;

        setCourses(updatedCourses);
        addToRecentSearches(updatedCourse);
        setEditIndex(null);
      } else {
        const res = await fetch(`${API_BASE}/course`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          throw new Error("Failed to add course");
        }
        const createdCourse = await res.json();
        const newCourse = createdCourse.course || createdCourse;
        const updatedCourses = [...courses, newCourse];

        setCourses(updatedCourses);
        addToRecentSearches(newCourse);
      }
      clearForm();
    } catch (error) {
      alert(error.message || "An error occurred while saving the course");
      console.error("Error adding course:", error.message || error);
    }
  };

  const handleEdit = (index) => {
    const course = courses[index];

    setForm({
      courseid: course.courseid,
      coursename: course.coursename,
      coursecode: course.coursecode,
      courselocation: course.courselocation,
      durationdays: course.durationdays,
      coursedetails: course.coursedetails,
      instructorname: course.instructorname,
      cost: course.cost,
    });

    setEditIndex(index);
    addToRecentSearches(course);
  };

  const handleDelete = async (index) => {
    const courseToDelete = courses[index];

    const res = await fetch(`${API_BASE}/course/${courseToDelete.courseid}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete course");
    }

    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);

    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = recentSearches.filter(
      (item) =>
        !(
          item.type === "Course" &&
          item.data &&
          item.data.courseid === courseToDelete.courseid
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
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white border rounded p-4">
            {isViewModalOpen && selectedCourse && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
                  <div className="flex items-center justify-between gap-4 border-b pb-3">
                    <h2 className="text-lg font-semibold !text-black">Course Details</h2>
                    <button
                      type="button"
                      onClick={closeViewModal}
                      className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-black"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div><span className="font-medium text-black">Course ID:</span> {selectedCourse.courseid}</div>
                    <div><span className="font-medium text-black">Course Name:</span> {selectedCourse.coursename}</div>
                    <div><span className="font-medium text-black">Course Code:</span> {selectedCourse.coursecode}</div>
                    <div><span className="font-medium text-black">Location:</span> {selectedCourse.courselocation}</div>
                    <div><span className="font-medium text-black">Duration:</span> {selectedCourse.durationdays} Days</div>
                    <div><span className="font-medium text-black">Instructor:</span> {selectedCourse.instructorname}</div>
                    <div><span className="font-medium text-black">Cost:</span> ₹{selectedCourse.cost}</div>
                    <div>
                      <span className="font-medium text-black">Details:</span>
                      <p className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-3 text-gray-700">
                        {selectedCourse.coursedetails}
                      </p>
                    </div>
                    <div><span className="font-medium text-black">Created At:</span> {selectedCourse.createdat}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold !text-black">Courses</h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Add course details below
              <br />
              <br />
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="courseid"
                placeholder="Course ID"
                value={form.courseid}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="coursename"
                placeholder="Course Name"
                value={form.coursename}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="coursecode"
                placeholder="Course Code"
                value={form.coursecode}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="courselocation"
                placeholder="Course Location"
                value={form.courselocation}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="number"
                name="durationdays"
                placeholder="Duration (Days)"
                value={form.durationdays}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="instructorname"
                placeholder="Instructor Name"
                value={form.instructorname}
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
                name="coursedetails"
                placeholder="Course Details"
                value={form.coursedetails}
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
                        <td className="border p-2">{course.courseid}</td>
                        <td className="border p-2">{course.coursename}</td>
                        <td className="border p-2">{course.coursecode}</td>
                        <td className="border p-2">{course.courselocation}</td>
                        <td className="border p-2">{course.durationdays} Days</td>
                        <td className="border p-2">{course.coursedetails}</td>
                        <td className="border p-2">{course.instructorname}</td>
                        <td className="border p-2">₹{course.cost}</td>
                        <td className="border p-2">{course.created_at}</td>
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
