import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Dashboard() {
  return (
    <div>
      <Navbar title="Dashboard" />
       <div className="bg-white rounded-2xl shadow p-6">
         <h2 className="text-2xl font-semibold !text-black">
            Welcome to HRMS
         </h2>

         <p className="text-gray-600 mt-2">
              Manage Employees, Departments, Courses and Enrollments using the menu on the left.
         </p>
</div>

      <div className="mt-8 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 !text-black">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <Link
            to="/employees"
            className="p-4 bg-blue-100 rounded-xl hover:bg-blue-200"
          >
            👨‍💼 Add Employee
          </Link>

          <Link
            to="/departments"
            className="p-4 bg-green-100 rounded-xl hover:bg-green-200"
          >
            🏢 Add Department
          </Link>

          <Link
            to="/courses"
            className="p-4 bg-purple-100 rounded-xl hover:bg-purple-200"
          >
            🎓 Add Course
          </Link>

          <Link
            to="/employee-courses"
            className="p-4 bg-orange-100 rounded-xl hover:bg-orange-200"
          >
            📅 Enroll Employee
          </Link>

        </div>
      </div>
    </div>
  );
}