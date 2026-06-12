import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();

  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];

  const openEmployee = (employee) => {
    localStorage.setItem("selectedEmployee", JSON.stringify(employee));
    navigate("/employee-profile");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="bg-white border rounded p-4 mb-6">
            <h1 className="text-2xl font-bold mb-2 !text-black">Dashboard</h1>
          </div>
          <div className="bg-white border rounded p-4">
            <h2 className="text-xl font-semibold mb-4 !text-black">
              Recent Searches
            </h2>

            {recentSearches.length === 0 ? (
              <p className="!text-black">No recent searches yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Employee ID</th>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Department</th>
                      <th className="border p-2 text-left">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentSearches.map((employee, index) => (
                      <tr key={index}>
                        <td className="border p-2">{employee.employeeId}</td>
                        <td className="border p-2">{employee.name}</td>
                        <td className="border p-2">{employee.department}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => openEmployee(employee)}
                            className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}