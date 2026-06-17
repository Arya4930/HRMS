import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function EmployeeList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [employees, setEmployees] = useState(
    JSON.parse(localStorage.getItem("employees")) || []
  );

  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);

  const saveEmployeesToStorage = (updatedEmployees) => {
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

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

  const handleEdit = (employee) => {
    setEditingEmployeeId(employee.employeeId);
    setEditedEmployee({ ...employee });
  };

  const handleCancel = () => {
    setEditingEmployeeId(null);
    setEditedEmployee(null);
  };

  const handleChange = (field, value) => {
    setEditedEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!editedEmployee) return;

    const values = Object.values(editedEmployee).map((value) =>
      String(value).trim()
    );

    if (values.some((value) => !value)) {
      alert("Please fill all fields");
      return;
    }

    const duplicate = employees.some(
      (employee) =>
        employee.employeeId === editedEmployee.employeeId &&
        employee.employeeId !== editingEmployeeId
    );

    if (duplicate) {
      alert("Employee ID already exists");
      return;
    }

    const updatedEmployees = employees.map((employee) =>
      employee.employeeId === editingEmployeeId ? editedEmployee : employee
    );

    saveEmployeesToStorage(updatedEmployees);

    const updatedRecentSearches =
      (JSON.parse(localStorage.getItem("recentSearches")) || []).map((item) =>
        item.employeeId === editingEmployeeId ? editedEmployee : item
      );

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedRecentSearches)
    );

    const selectedEmployee = JSON.parse(
      localStorage.getItem("selectedEmployee")
    );

    if (selectedEmployee && selectedEmployee.employeeId === editingEmployeeId) {
      localStorage.setItem(
        "selectedEmployee",
        JSON.stringify(editedEmployee)
      );
    }

    setEditingEmployeeId(null);
    setEditedEmployee(null);
    alert("Employee updated successfully");
  };

  const handleDelete = (employeeId) => {
    const updatedEmployees = employees.filter(
      (employee) => employee.employeeId !== employeeId
    );

    const updatedRecentSearches =
      (JSON.parse(localStorage.getItem("recentSearches")) || []).filter(
        (item) => item.employeeId !== employeeId
      );

    const selectedEmployee = JSON.parse(
      localStorage.getItem("selectedEmployee")
    );

    if (selectedEmployee && selectedEmployee.employeeId === employeeId) {
      localStorage.removeItem("selectedEmployee");
    }

    if (editingEmployeeId === employeeId) {
      handleCancel();
    }

    saveEmployeesToStorage(updatedEmployees);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedRecentSearches)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white border rounded p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold !text-black">
                Employee List
              </h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Search saved employees, view profiles, edit details directly in the
              table, or delete records.
              <br/>
              <br/>
            </p>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, department, email, ID..."
                className="flex-1 border rounded px-3 py-2 bg-white outline-none focus:border-black"
              />

              <Link
                to="/add-employee"
                className="border rounded px-4 py-2 bg-gray-100 hover:bg-gray-200 text-center"
              >
                Add Employee
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
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
                      <td className="border p-3 text-center" colSpan="7">
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => {
                      const isEditing =
                        editingEmployeeId === employee.employeeId;

                      return (
                        <tr key={employee.employeeId} className="bg-white">
                          <td className="border p-2">
                            {isEditing ? (
                              <input
                                value={editedEmployee?.employeeId || ""}
                                onChange={(e) =>
                                  handleChange("employeeId", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1 outline-none"
                              />
                            ) : (
                              employee.employeeId
                            )}
                          </td>

                          <td className="border p-2">
                            {isEditing ? (
                              <input
                                value={editedEmployee?.name || ""}
                                onChange={(e) =>
                                  handleChange("name", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1 outline-none"
                              />
                            ) : (
                              employee.name
                            )}
                          </td>

                          <td className="border p-2">
                            {isEditing ? (
                              <input
                                value={editedEmployee?.department || ""}
                                onChange={(e) =>
                                  handleChange("department", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1 outline-none"
                              />
                            ) : (
                              employee.department
                            )}
                          </td>

                          <td className="border p-2">
                            {isEditing ? (
                              <input
                                value={editedEmployee?.email || ""}
                                onChange={(e) =>
                                  handleChange("email", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1 outline-none"
                              />
                            ) : (
                              employee.email
                            )}
                          </td>

                          <td className="border p-2">
                            {isEditing ? (
                              <input
                                value={editedEmployee?.phone || ""}
                                onChange={(e) =>
                                  handleChange("phone", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1 outline-none"
                              />
                            ) : (
                              employee.phone
                            )}
                          </td>

                          <td className="border p-2">
                            {isEditing ? (
                              <input
                                type="date"
                                value={editedEmployee?.joiningDate || ""}
                                onChange={(e) =>
                                  handleChange("joiningDate", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1 outline-none"
                              />
                            ) : (
                              employee.joiningDate
                            )}
                          </td>

                          <td className="border p-2">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleViewProfile(employee)}
                                className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                              >
                                View
                              </button>

                              {isEditing ? (
                                <>
                                  <button
                                    onClick={handleSave}
                                    className="border px-3 py-1 rounded bg-black text-white hover:bg-gray-800"
                                  >
                                    Save
                                  </button>

                                  <button
                                    onClick={handleCancel}
                                    className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleEdit(employee)}
                                  className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                                >
                                  Edit
                                </button>
                              )}

                              <button
                                onClick={() => handleDelete(employee.employeeId)}
                                className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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