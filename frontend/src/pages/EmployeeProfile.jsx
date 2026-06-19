import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../main";

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
  const [newCourseID, setNewCourseID] = useState("");
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
    const employeeId = employee?.emp_id;

    if (!employeeId) {
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
      const response = await fetch(`${API_BASE}/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete employee");
      }

      const currentEmployees = JSON.parse(localStorage.getItem("employees")) || [];
      const updatedEmployees = currentEmployees.filter(
        (item) => String(item.emp_id) !== String(employeeId)
      );
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));

      const currentSelectedEmployee =
        JSON.parse(localStorage.getItem("selectedEmployee")) || null;
      if (
        currentSelectedEmployee &&
        String(currentSelectedEmployee.emp_id) === String(employeeId)
      ) {
        localStorage.removeItem("selectedEmployee");
      }

      const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
      const updatedRecentSearches = recentSearches.filter(
        (item) => String(item.emp_id) !== String(employeeId)
      );
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));

      alert("Employee deleted successfully");
      navigate("/employees");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(error.message || "Error deleting employee");
    }
  };

  const addCourse = () => async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/employees/addCourse/${employee.emp_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: newCourseID }),
      });
      if(!res.ok) {
        throw new Error("Failed to add course");
      }
      const updatedEmployee = await res.json();
      setEmployee(updatedEmployee);
      setNewCourseID("");
      alert("Course added successfully!");
    } catch(err) {
      console.log("Error adding course:", err);
      alert("Error adding course. Please try again.");
    }
  }

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
          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold !text-black">
                Employee Profile
              </h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Saved details from the selected employee
              <br/>
              <br/>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-semibold">{employee?.emp_id || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">First Name</p>
                <p className="font-semibold">{employee?.first_name || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="font-semibold">{employee?.last_name || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold">{[employee?.first_name, employee?.last_name].filter((value) => value !== "-").join(" ") || employee?.name || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{employee?.email || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{employee?.phone || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-semibold">{employee?.date_of_birth || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Hiring Date</p>
                <p className="font-semibold">{employee?.hire_date || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="font-semibold">{employee?.job_title || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold">{employee?.department_id || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">{employee?.status || "-"}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Zipcode</p>
                <p className="font-semibold">{employee?.zipcode || "-"}</p>
              </div>

              <div className="border rounded p-4 md:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold">{employee?.address || "-"}</p>
              </div>

              <div className="border rounded p-4 md:col-span-2">
                <p className="text-sm text-gray-500">Courses</p>
                {employee?.courses && (
                  <div>
                    {employee.courses.map((course) => (
                      <p key={course.id} className="font-semibold">
                        {course.courseName}
                      </p>
                    ))}
                  </div>
                )}
                <form className="mt-2 flex items-center gap-2" onSubmit={addCourse()} value={newCourseID} onChange={(e) => setNewCourseID(e.target.value)}>
                  <input type="text" placeholder="Course ID" />
                  <label htmlFor="addCourse" className="ml-2">
                    <button type="submit" className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
                      Add Course
                    </button>
                  </label>
                </form>
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