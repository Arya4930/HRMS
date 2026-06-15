import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function getEmployeeName(employee) {
  return (
    [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
    employee.name ||
    "Unnamed Employee"
  );
}

function getSearchableEmployeeText(employee) {
  return [
    employee.employeeId,
    employee.firstName,
    employee.lastName,
    getEmployeeName(employee),
    employee.email,
    employee.phone_number,
    employee.date_of_birth,
    employee.hire_date,
    employee.jobTitle,
    employee.department_id ,
    employee.status,
    employee.zipcode,
    employee.address,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function EmployeeList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return employees;

    return employees.filter((employee) => {
      return getSearchableEmployeeText(employee).includes(term);
    });
  }, [employees, searchTerm]);

  const handleViewProfile = (employee) => {
    localStorage.setItem("selectedEmployee", JSON.stringify(employee));

    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = [
      employee,
      ...recentSearches.filter(
        (item) => item.employeeId !== employee.employeeId
      ),
    ].slice(0, 5);

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedRecentSearches)
    );

    navigate("/employee-profile");
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-100 text-black flex flex-col">
      <Navbar />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />

        <main className="flex-1 min-h-0 p-6 overflow-hidden">
          <div className="bg-white border rounded p-4 h-full flex flex-col min-h-0">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold !text-black">
                Employee List
              </h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Search saved employees and open their profile
              <br/>
              <br/>
            </p>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, department, email, ID..."
                className="flex-1 border rounded px-3 py-2 bg-white"
              />

              <Link
                to="/add-employee"
                className="border rounded px-4 py-2 bg-gray-100 hover:bg-gray-200 text-center"
              >
                Add Employee
              </Link>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <table className="w-full min-w-[1400px] border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Employee ID</th>
                    <th className="border p-2 text-left">First Name</th>
                    <th className="border p-2 text-left">Last Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Phone</th>
                    <th className="border p-2 text-left">Date of Birth</th>
                    <th className="border p-2 text-left">Hiring Date</th>
                    <th className="border p-2 text-left">Job Title</th>
                    <th className="border p-2 text-left">Department</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Zipcode</th>
                    <th className="border p-2 text-left">Address</th>
                    <th className="border p-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td className="border p-3" colSpan="13">
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee, index) => (
                      <tr key={index}>
                        <td className="border p-2">{employee.employeeId}</td>
                        <td className="border p-2">{employee.firstName || "-"}</td>
                        <td className="border p-2">{employee.lastName || "-"}</td>
                        <td className="border p-2">{employee.email}</td>
                        <td className="border p-2">{employee.phone_number || "-"}</td>
                        <td className="border p-2">{employee.date_of_birth || "-"}</td>
                        <td className="border p-2">{employee.hire_date || "-"}</td>
                        <td className="border p-2">{employee.jobTitle || "-"}</td>
                        <td className="border p-2">{employee.department_id || "-"}</td>
                        <td className="border p-2">{employee.status || "-"}</td>
                        <td className="border p-2">{employee.zipcode || "-"}</td>
                        <td className="border p-2">{employee.address || "-"}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleViewProfile(employee)}
                            className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            View Profile
                          </button>
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