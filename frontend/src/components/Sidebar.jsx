import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-white border-r shadow-sm p-5">
      <div className="bg-slate-900 text-white rounded-2xl p-4 mb-8">
        <h1 className="text-2xl font-bold">HRMS</h1>
        <p className="text-sm text-slate-300 mt-1">Employee management system</p>
      </div>

      <nav className="space-y-2">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100">
          <Users size={18} /> Employee Details
        </Link>
        <Link to="/departments" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100">
          <BriefcaseBusiness size={18} /> Departments
        </Link>
        <Link to="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100">
          <GraduationCap size={18} /> Courses
        </Link>
        <Link to="/employee-courses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100">
          <CalendarDays size={18} /> Employee Courses
        </Link>
      </nav>
    </aside>
  );
}