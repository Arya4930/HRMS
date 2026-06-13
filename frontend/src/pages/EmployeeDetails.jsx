import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function EmployeeDetails() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    department: "",
    email: "",
    phone: "",
    joiningDate: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const values = Object.values(form).map((value) => value.trim());
    if (values.some((value) => !value)) {
      alert("Please fill all fields");
      return;
    }

    const employees =
      JSON.parse(localStorage.getItem("employees")) || [];

    const duplicate = employees.some(
      (emp) => emp.employeeId === form.employeeId
    );

    if (duplicate) {
      alert("Employee ID already exists");
      return;
    }

    const updatedEmployees = [...employees, form];
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    localStorage.setItem("selectedEmployee", JSON.stringify(form));

    alert("Employee saved successfully");
    navigate("/employees");
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
                Employee Details
              </h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Fill in the employee information below
              <br/>
              <br />
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Employee ID"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Department"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Phone Number"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}