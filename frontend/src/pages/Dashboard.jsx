import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function getRecentSearches() {
  try {
    const value = JSON.parse(localStorage.getItem("recentSearches")) || [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function unwrapRecentData(item) {
  const data = item?.data || item;
  return data?.employee || data?.department || data?.course || data;
}

function getEmployeeName(employee) {
  return [employee.first_name, employee.last_name].filter(Boolean).join(" ");
}

function normalizeRecentItem(item) {
  const data = unwrapRecentData(item);
  const type =
    item?.type ||
    (data?.emp_id ? "Employee" : "") ||
    (data?.departmentid || data?.departmentId ? "Department" : "") ||
    (data?.courseid || data?.courseId ? "Course" : "") ||
    "Unknown";

  if (type === "Employee") {
    return {
      type,
      id: data.emp_id || data.employeeid || data.employeeId || "-",
      name: getEmployeeName(data) || data.name || "-",
      detail: data.department_id || data.department || "-",
      searchedAt: item?.searchedAt || data.created_at || "-",
      data,
    };
  }

  if (type === "Department") {
    return {
      type,
      id: data.departmentid || data.departmentId || "-",
      name: data.departmentname || data.departmentName || item?.name || "-",
      detail: data.departmentemail || data.departmentEmail || data.location || "-",
      searchedAt: item?.searchedAt || data.createdat || data.createdAt || "-",
      data,
    };
  }

  if (type === "Course") {
    return {
      type,
      id: data.courseid || data.courseId || "-",
      name: data.coursename || data.courseName || item?.name || "-",
      detail: data.coursecode || data.courseCode || item?.code || "-",
      searchedAt: item?.searchedAt || data.created_at || data.createdAt || "-",
      data,
    };
  }

  return {
    type,
    id: "-",
    name: item?.name || "-",
    detail: "-",
    searchedAt: item?.searchedAt || "-",
    data,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const recentSearches = getRecentSearches().map(normalizeRecentItem);

  const openRecentItem = (item) => {
    if (item.type === "Employee") {
      localStorage.setItem("selectedEmployee", JSON.stringify(item.data));
      navigate(item.id !== "-" ? `/employee-profile/${item.id}` : "/employee-profile");
      return;
    }

    if (item.type === "Department") {
      navigate("/departments");
      return;
    }

    if (item.type === "Course") {
      navigate("/courses");
    }
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
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-left">ID</th>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Details</th>
                      <th className="border p-2 text-left">Searched At</th>
                      <th className="border p-2 text-left">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentSearches.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.type}</td>
                        <td className="border p-2">{item.id}</td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.detail}</td>
                        <td className="border p-2">{item.searchedAt}</td>
                        <td className="border p-2">
                          <button
                            type="button"
                            onClick={() => openRecentItem(item)}
                            className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            Open
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
