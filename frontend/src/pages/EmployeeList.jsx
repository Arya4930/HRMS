import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function EmployeeList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return employees;

    return employees.filter((employee) => {
      return (
        employee.employeeId.toLowerCase().includes(term) ||
        employee.name.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.phone.toLowerCase().includes(term) ||
        employee.joiningDate.toLowerCase().includes(term)
      );
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
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white border rounded p-4">
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

            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Employee ID</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Department</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Phone</th>
                    <th className="border p-2 text-left">Joining Date</th>
                    <th className="border p-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td className="border p-3" colSpan="7">
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee, index) => (
                      <tr key={index}>
                        <td className="border p-2">{employee.employeeId}</td>
                        <td className="border p-2">{employee.name}</td>
                        <td className="border p-2">{employee.department}</td>
                        <td className="border p-2">{employee.email}</td>
                        <td className="border p-2">{employee.phone}</td>
                        <td className="border p-2">{employee.joiningDate}</td>
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