import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SquarePen } from "lucide-react";

function getEmployeeName(employee) {
  return (
    [employee.first_name, employee.last_name].filter(Boolean).join(" ") ||
    employee.name ||
    "Unnamed Employee"
  );
}

function getSearchableEmployeeText(employee) {
  return [
    employee.emp_id,
    employee.first_name,
    employee.last_name,
    getEmployeeName(employee),
    employee.email,
    employee.phone,
    employee.date_of_birth,
    employee.hire_date,
    employee.job_title,
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
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/employees");
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        const normalizedEmployees = Array.isArray(data)
          ? data
          : Array.isArray(data?.employees)
            ? data.employees
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setEmployees(
          normalizedEmployees.length > 0
            ? normalizedEmployees
            : []
        );
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return employees;

    return employees.filter((employee) => {
      return getSearchableEmployeeText(employee).includes(term);
    });
  }, [employees, searchTerm]);

  const handleEditEmployee = (employee) => {
    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = [
      employee,
      ...recentSearches.filter(
        (item) => item.emp_id !== employee.emp_id
      ),
    ].slice(0, 5);

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedRecentSearches)
    );

    navigate(`/edit-employee/${employee.emp_id}`);
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
                    <th className="border p-2 text-left">Edit</th>
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
                        <td className="border p-2">{employee.emp_id}</td>
                        <td className="border p-2">{employee.first_name || "-"}</td>
                        <td className="border p-2">{employee.last_name || "-"}</td>
                        <td className="border p-2">{employee.email}</td>
                        <td className="border p-2">{employee.phone || "-"}</td>
                        <td className="border p-2">{employee.date_of_birth || "-"}</td>
                        <td className="border p-2">{employee.hire_date || "-"}</td>
                        <td className="border p-2">{employee.job_title || "-"}</td>
                        <td className="border p-2">{employee.department_id || "-"}</td>
                        <td className="border p-2">{employee.status || "-"}</td>
                        <td className="border p-2">{employee.zipcode || "-"}</td>
                        <td className="border p-2">{employee.address || "-"}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            <SquarePen className="w-4 h-4" />
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