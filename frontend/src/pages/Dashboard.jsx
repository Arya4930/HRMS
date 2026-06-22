import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();

  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];

  const openEmployee = (employee) => {
    localStorage.setItem("selectedEmployee", JSON.stringify(employee));
    const employeeid = employee.emp_id || employee.employeeid;
    navigate(employeeid ? `/employee-profile/${employeeid}` : "/employee-profile");
  };

  const getRecentId = (item) =>
    item.emp_id || item.employeeid || item.data?.departmentid || item.data?.courseid || "-";

  const getRecentName = (item) =>
    item.name ||
    [item.first_name, item.last_name].filter(Boolean).join(" ") ||
    item.data?.departmentname ||
    item.data?.coursename ||
    "-";

  const getRecentDepartment = (item) =>
    item.department || item.department_id || item.data?.departmentid || "-";

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
                        <td className="border p-2">{getRecentId(employee)}</td>
                        <td className="border p-2">{getRecentName(employee)}</td>
                        <td className="border p-2">{getRecentDepartment(employee)}</td>
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
