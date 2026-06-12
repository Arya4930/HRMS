import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold !text-black">HRMS</h1>
        </div>

        <button
          onClick={handleLogout}
          className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}