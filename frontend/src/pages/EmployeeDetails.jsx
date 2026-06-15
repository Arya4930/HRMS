import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function parseCsvLine(line) {
  const values = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === "," && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());
  return values;
}

function formatAddress(record) {
  return [record.officename, record.district, record.statename, record.pincode]
    .filter(Boolean)
    .join(", ");
}

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [zipcodes, setZipcodes] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    hireDate: "",
    jobTitle: "",
    departmentId: "",
    status: "",
    zipcode: "",
    address: "",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await fetch("http://localhost:3000/api/employees");
        const data = await employees.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchZipcodes = async () => {
      try {
        const response = await fetch("/zipcodes.csv");
        const csvText = await response.text();

        const rows = csvText
          .split(/\r?\n/)
          .map((row) => row.trim())
          .filter(Boolean);

        if (rows.length < 2) {
          setZipcodes([]);
          return;
        }

        const headers = parseCsvLine(rows[0]).map((header) => header.trim());
        const parsedRows = rows.slice(1).map((row) => {
          const columns = parseCsvLine(row);
          return headers.reduce((record, header, index) => {
            record[header] = columns[index] ?? "";
            return record;
          }, {});
        });

        setZipcodes(parsedRows);
      } catch (error) {
        console.error("Error fetching zipcodes:", error);
      }
    };

    fetchZipcodes();
  }, []);

  const matchingAddresses = useMemo(() => {
    const zip = form.zipcode.trim();

    if (!zip) {
      return [];
    }

    return zipcodes.filter((record) => String(record.pincode).trim() === zip);
  }, [form.zipcode, zipcodes]);

  useEffect(() => {
    if (!form.zipcode.trim()) {
      setForm((currentForm) =>
        currentForm.address === ""
          ? currentForm
          : { ...currentForm, address: "" }
      );
      return;
    }

    if (!matchingAddresses.length) {
      setForm((currentForm) =>
        currentForm.address === ""
          ? currentForm
          : { ...currentForm, address: "" }
      );
      return;
    }

    const nextAddress = formatAddress(matchingAddresses[0]);
    setForm((currentForm) =>
      currentForm.address === nextAddress
        ? currentForm
        : { ...currentForm, address: nextAddress }
    );
  }, [form.zipcode, matchingAddresses]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = Object.values(form).map((value) => value.trim());
    if (values.some((value) => !value)) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log("Employee saved:", data);
      const updatedEmployees = [...employees, form];
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      localStorage.setItem("selectedEmployee", JSON.stringify(form));

      alert("Employee saved successfully");
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Error saving employee");
    }
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
              <br />
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
                <label className="block mb-2 text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter First Name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Last Name"
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
                  Hiring Date
                </label>
                <input
                  type="date"
                  name="hiringDate"
                  value={form.hiringDate}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Job Title"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Department ID
                </label>
                <input
                  type="text"
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Department ID"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Status
                </label>
                <input
                  type="text"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Status"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Zipcode
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={form.zipcode}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Enter Zipcode"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Address
                </label>
                <select
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  disabled={!matchingAddresses.length}
                >
                  <option value="">
                    {form.zipcode.trim()
                      ? matchingAddresses.length
                        ? "Select address"
                        : "No address found for this zipcode"
                      : "Enter zipcode first"}
                  </option>
                  {matchingAddresses.map((record, index) => {
                    const address = formatAddress(record);
                    return (
                      <option
                        key={`${record.pincode}-${record.officename}-${index}`}
                        value={address}
                      >
                        {address}
                      </option>
                    );
                  })}
                </select>
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