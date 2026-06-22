import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../api";

function formatDate(value) {
  if (!value || value === "-") {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

function formatDateInput(value) {
  if (!value || value === "-") {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

const emptyCourseForm = {
  courseid: "",
  enrollment_date: "",
  completion_status: "ONGOING",
  completion_date: "",
  score: "",
  certificate_issued: false,
};

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const selectedEmployee =
    location.state?.employee ||
    JSON.parse(localStorage.getItem("selectedEmployee")) ||
    null;

  const lastSavedEmployee =
    (JSON.parse(localStorage.getItem("employees")) || []).at(-1) || null;

  const [employee, setEmployee] = useState(
    selectedEmployee || lastSavedEmployee || null
  );
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [editingEnrollmentId, setEditingEnrollmentId] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchEmployee = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_BASE}/employees/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch employee details");
        }

        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    const employeeid = employee?.emp_id;

    if (!employeeid) {
      alert("No employee id found for this profile.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this employee profile? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/employees/${employeeid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete employee");
      }

      const currentEmployees = JSON.parse(localStorage.getItem("employees")) || [];
      const updatedEmployees = currentEmployees.filter(
        (item) => String(item.emp_id) !== String(employeeid)
      );
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));

      const currentSelectedEmployee =
        JSON.parse(localStorage.getItem("selectedEmployee")) || null;
      if (
        currentSelectedEmployee &&
        String(currentSelectedEmployee.emp_id) === String(employeeid)
      ) {
        localStorage.removeItem("selectedEmployee");
      }

      const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
      const updatedRecentSearches = recentSearches.filter(
        (item) => String(item.emp_id) !== String(employeeid)
      );
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));

      alert("Employee deleted successfully");
      navigate("/employees");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(error.message || "Error deleting employee");
    }
  };

  const resetCourseForm = () => {
    setCourseForm(emptyCourseForm);
    setEditingEnrollmentId(null);
  };

  const saveCourse = () => async (e) => {
    e.preventDefault();

    try {
      const isEditingCourse = Boolean(editingEnrollmentId);
      const res = await fetch(
        isEditingCourse
          ? `${API_BASE}/employees/${employee.emp_id}/course/${editingEnrollmentId}`
          : `${API_BASE}/employees/addCourse/${employee.emp_id}`,
        {
        method: isEditingCourse ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseForm),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || (isEditingCourse ? "Failed to update course" : "Failed to add course"));
      }
      const data = await res.json();
      setEmployee(data.employee);
      resetCourseForm();
      alert(isEditingCourse ? "Course updated successfully!" : "Course added successfully!");
    } catch (err) {
      console.log("Error saving course:", err);
      alert(err.message || "Error saving course. Please try again.");
    }
  }

  const editCourse = (course) => {
    setEditingEnrollmentId(course.enrollment_id);
    setCourseForm({
      courseid: course.courseid || "",
      enrollment_date: formatDateInput(course.enrollment_date),
      completion_status: course.completion_status || "ONGOING",
      completion_date: formatDateInput(course.completion_date),
      score: course.score ?? "",
      certificate_issued: Boolean(course.certificate_issued),
    });
  };

  const removeCourse = async (course) => {
    const confirmed = window.confirm("Remove this course from the employee?");

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/employees/${employee.emp_id}/course/${course.enrollment_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove course");
      }

      const data = await res.json();
      setEmployee(data.employee);

      if (editingEnrollmentId === course.enrollment_id) {
        resetCourseForm();
      }

      alert("Course removed successfully!");
    } catch (err) {
      console.log("Error removing course:", err);
      alert(err.message || "Error removing course. Please try again.");
    }
  };

  const handleCourseFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setCourseForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-100 text-black">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <div className="bg-white border rounded p-4 text-center">
              <h1 className="text-2xl font-bold mb-3">
                No Employee Data Found
              </h1>
              <p className="text-gray-600 mb-4 font-bold">
                Please fill the employee details first.
              </p>
              <Link
                to="/add-employee"
                className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 inline-block"
              >
                Add Employee
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 text-black">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <div className="bg-white border rounded p-4 text-center">
              <h1 className="text-2xl font-bold mb-3">Loading Employee...</h1>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white border rounded p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold !text-black">
                Employee Profile
              </h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Saved details from the selected employee
              <br />
              <br />
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-semibold">{employee?.emp_id || "-"}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">First Name</p>
                <p className="font-semibold">{employee?.first_name || "-"}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="font-semibold">{employee?.last_name || "-"}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold">
                  {[employee?.first_name, employee?.last_name].filter(Boolean).join(" ") || employee?.name || "-"}
                </p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{employee?.email || "-"}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{employee?.phone || "-"}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-semibold">{formatDate(employee?.date_of_birth)}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Hiring Date</p>
                <p className="font-semibold">{formatDate(employee?.hire_date)}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="font-semibold">{employee?.job_title || "-"}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold">{employee?.department_id || "-"}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">{employee?.status || "-"}</p>
              </div>

              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Zipcode</p>
                <p className="font-semibold">{employee?.zipcode || "-"}</p>
              </div>

              <div className="border rounded p-4 md:col-span-2 bg-gray-50">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold">{employee?.address || "-"}</p>
              </div>

              <div className="border rounded p-4 md:col-span-2 bg-gray-50">
                <p className="text-sm text-gray-500">Courses</p>
                <div className="mt-2 space-y-3">
                  {employee?.courses?.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] border bg-white text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border p-2 text-left">Course ID</th>
                            <th className="border p-2 text-left">Course</th>
                            <th className="border p-2 text-left">Enrollment Date</th>
                            <th className="border p-2 text-left">Status</th>
                            <th className="border p-2 text-left">Completion Date</th>
                            <th className="border p-2 text-left">Score</th>
                            <th className="border p-2 text-left">Certificate</th>
                            <th className="border p-2 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employee.courses.map((course) => (
                            <tr key={course.enrollment_id}>
                              <td className="border p-2">{course.courseid || "-"}</td>
                              <td className="border p-2">{course.coursename || "-"}</td>
                              <td className="border p-2">{formatDate(course.enrollment_date)}</td>
                              <td className="border p-2">{course.completion_status || "-"}</td>
                              <td className="border p-2">{formatDate(course.completion_date)}</td>
                              <td className="border p-2">{course.score ?? "-"}</td>
                              <td className="border p-2">{course.certificate_issued ? "Yes" : "No"}</td>
                              <td className="border p-2">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => editCourse(course)}
                                    className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeCourse(course)}
                                    className="border px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No courses assigned yet.</p>
                  )}

                  <form
                    className="grid grid-cols-1 gap-3 md:grid-cols-3"
                    onSubmit={saveCourse()}
                  >
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Course ID</label>
                      <input
                        type="text"
                        name="courseid"
                        placeholder="Course ID"
                        value={courseForm.courseid}
                        onChange={handleCourseFormChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Enrollment Date</label>
                      <input
                        type="date"
                        name="enrollment_date"
                        value={courseForm.enrollment_date}
                        onChange={handleCourseFormChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Status</label>
                      <select
                        name="completion_status"
                        value={courseForm.completion_status}
                        onChange={handleCourseFormChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                        required
                      >
                        <option value="ONGOING">ONGOING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="FAILED">FAILED</option>
                        <option value="DROPPED">DROPPED</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Completion Date</label>
                      <input
                        type="date"
                        name="completion_date"
                        value={courseForm.completion_date}
                        onChange={handleCourseFormChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                      />
                    </div>
                    <input
                      type="number"
                      name="score"
                      placeholder="Score"
                      value={courseForm.score}
                      onChange={handleCourseFormChange}
                      className="w-full border rounded px-3 py-2 bg-white"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                    <label className="flex items-center gap-2 rounded border bg-white px-3 py-2">
                      <input
                        type="checkbox"
                        name="certificate_issued"
                        checked={courseForm.certificate_issued}
                        onChange={handleCourseFormChange}
                      />
                      <span>Certificate Issued</span>
                    </label>
                    <button
                      type="submit"
                      className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                    >
                      {editingEnrollmentId ? "Update Course" : "Add Course"}
                    </button>
                    {editingEnrollmentId ? (
                      <button
                        type="button"
                        onClick={resetCourseForm}
                        className="border px-4 py-2 rounded bg-white hover:bg-gray-100 md:col-span-2"
                      >
                        Cancel Edit
                      </button>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/employees"
                className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 inline-block"
              >
                Back to Employees
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="border px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
