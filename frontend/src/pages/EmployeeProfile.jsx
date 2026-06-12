import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

export default function EmployeeProfile() {
  const selectedEmployee =
    JSON.parse(localStorage.getItem("selectedEmployee")) || null;

  const lastSavedEmployee =
    (JSON.parse(localStorage.getItem("employees")) || []).at(-1) || null;

  const employee = selectedEmployee || lastSavedEmployee;

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-semibold">{employee.employeeId}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold">{employee.name}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold">{employee.department}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{employee.email}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{employee.phone}</p>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm text-gray-500">Date of Joining</p>
                <p className="font-semibold">{employee.joiningDate}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}