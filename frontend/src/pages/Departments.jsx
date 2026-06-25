import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../api";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

function formatDateInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [selectedDeparment, setSelectedDeparment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  });
  const limit = 10;

  const [form, setForm] = useState({
    departmentid: "",
    departmentname: "",
    establisheddate: "",
    departmentemail: "",
    location: "",
    budget: "",
  });

  useEffect(() => {
    const fetchDeparments = async () => {
      try {
        const res = await fetch(`${API_BASE}/department?page=${page}&limit=${limit}`);
        if (!res.ok) {
          throw new Error("Failed to fetch deparments");
        }
        const data = await res.json();
        const normalizedDepartments = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

        setDepartments(normalizedDepartments);
        setPagination(data?.pagination || {
          page,
          limit,
          total: normalizedDepartments.length,
          totalPages: 1,
          hasPrevious: page > 1,
          hasNext: false,
        });

      } catch (err) {
        alert(err.message || "An error occurred while fetching the deparments");
        console.log(err);
      }
    }

    fetchDeparments();
  }, [page])

  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setForm({
      departmentid: "",
      departmentname: "",
      establisheddate: "",
      departmentemail: "",
      location: "",
      budget: "",
    });
  };

  const addToRecentSearches = (dept) => {
    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = [
      {
        type: "Department",
        name: dept.departmentname,
        searchedAt: new Date().toLocaleString(),
        data: dept,
      },
      ...recentSearches.filter(
        (item) =>
          !(
            item.type === "Department" &&
            item.data &&
            item.data.departmentid === dept.departmentid
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
      alert("Please fill all the fields");
      return;
    }

    try {
      if (editIndex !== null) {
        const res = await fetch(`${API_BASE}/department/${departments[editIndex].departmentid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          throw new Error("Failed to update Department");
        }
        const updatedDepts = [...departments];
        const updatedDept = {
          ...updatedDepts[editIndex],
          ...form,
          createdat: updatedDepts[editIndex].createdat,
        };

        updatedDepts[editIndex] = updatedDept;

        setDepartments(updatedDepts);
        addToRecentSearches(updatedDept);
        setEditIndex(null);
      } else {
        const res = await fetch(`${API_BASE}/department`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          throw new Error("Failed to add Deparment");
        }
        const createdDept = await res.json();
        const newDept = createdDept.department || createdDept;
        const updatedDepts = [...departments, newDept];

        setDepartments(updatedDepts);
        addToRecentSearches(newDept);
      }
      clearForm();
    } catch (err) {
      alert(err.message || "An error occurred while saving the Department");
      console.error("Error adding Department:", err.message || err);
    }
  }

  const handleEdit = (index) => {
    const dept = departments[index];

    setForm({
      departmentid: dept.departmentid,
      departmentname: dept.departmentname,
      establisheddate: formatDateInput(dept.establisheddate),
      departmentemail: dept.departmentemail,
      location: dept.location,
      budget: dept.budget,
    });

    setEditIndex(index);
    addToRecentSearches(dept);
  };

  const handleDelete = async (index) => {
    const DeptToDelete = departments[index];

    const res = await fetch(`${API_BASE}/department/${DeptToDelete.departmentid}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete Deparment");
    }

    const updatedDepts = departments.filter((_, i) => i !== index);
    setDepartments(updatedDepts);

    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const updatedRecentSearches = recentSearches.filter(
      (item) =>
        !(
          item.type === "Department" &&
          item.data &&
          item.data.departmentid === DeptToDelete.departmentid
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
    const dept = departments[index];
    addToRecentSearches(dept);
    setSelectedDeparment(dept);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDeparment(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white border rounded p-4">
            {isViewModalOpen && selectedDeparment && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
                  <div className="flex items-center justify-between gap-4 border-b pb-3">
                    <h2 className="text-lg font-semibold !text-black">Department Details</h2>
                    <button
                      type="button"
                      onClick={closeViewModal}
                      className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-black"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div><span className="font-medium text-black">Department ID:</span> {selectedDeparment.departmentid}</div>
                    <div><span className="font-medium text-black">Department Name:</span> {selectedDeparment.departmentname}</div>
                    <div><span className="font-medium text-black">Established Date:</span> {formatDate(selectedDeparment.establisheddate)}</div>
                    <div><span className="font-medium text-black">Department Email:</span> {selectedDeparment.departmentemail}</div>
                    <div><span className="font-medium text-black">Location:</span> {selectedDeparment.location}</div>
                    <div><span className="font-medium text-black">Budget:</span> ₹{selectedDeparment.budget}</div>
                    <div><span className="font-medium text-black">Created At:</span> {selectedDeparment.createdat}</div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold !text-black">
                Departments
              </h1>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <p className="text-gray-600 mb-6">
              Add department details below
              <br />
              <br />
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="departmentid"
                placeholder="Department ID"
                value={form.departmentid}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="departmentname"
                placeholder="Department Name"
                value={form.departmentname}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Established Date (DD/MM/YYYY)
                </label>
                <input
                  type="date"
                  name="establisheddate"
                  value={form.establisheddate}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 bg-white w-full"
                />
              </div>

              <input
                type="email"
                name="departmentemail"
                placeholder="Department Email"
                value={form.departmentemail}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <input
                type="number"
                name="budget"
                placeholder="Budget"
                value={form.budget}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  {editIndex !== null
                    ? "Update Department"
                    : "Add Department"}
                </button>
              </div>
            </form>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Established</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Location</th>
                    <th className="border p-2">Budget</th>
                    <th className="border p-2">Created At</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {departments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="border p-3 text-center">
                        No departments found
                      </td>
                    </tr>
                  ) : (
                    departments.map((dept, index) => (
                      <tr key={index}>
                        <td className="border p-2">{dept.departmentid}</td>
                        <td className="border p-2">{dept.departmentname}</td>
                        <td className="border p-2">
                          {formatDate(dept.establisheddate)}
                        </td>
                        <td className="border p-2">{dept.departmentemail}</td>
                        <td className="border p-2">{dept.location}</td>
                        <td className="border p-2">₹{dept.budget}</td>
                        <td className="border p-2">{formatDate(dept.createdat)}</td>
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

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} departments)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrevious}
                  onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                  className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous Page
                </button>
                <button
                  type="button"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
