import {
  Activity,
  BookOpenCheck,
  Building2,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  GraduationCap,
  IndianRupee,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../api";

const mutedPalette = ["#334155", "#64748b", "#78716c", "#52525b", "#475569", "#71717a"];

function formatCompact(value) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value) {
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(value || 0))}`;
}

function percentage(value, total) {
  if (!total) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

function Card({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function CardHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
      <div className="text-left">
        <div className="text-base font-semibold text-gray-950">{title}</div>
        {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
      </div>
      {Icon ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  );
}

function KpiCard({ label, value, subtitle }) {
  return (
    <Card className="p-5">
      <div className="text-left">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-normal !text-gray-950">{value}</p>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-sm shadow-lg">
      <p className="font-medium text-gray-950">{label || payload[0].name}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey || entry.name} className="mt-1 text-gray-600">
          {entry.name}: <span className="font-semibold text-gray-900">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function DonutLegend({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length || !total) {
    return <p className="text-sm text-gray-500">No status data available.</p>;
  }

  return (
    <div className="grid gap-2">
      {data.map((item, index) => (
        <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: mutedPalette[index % mutedPalette.length] }}
            />
            {item.name}
          </span>
          <span className="font-medium text-gray-900">{percentage(item.value, total)}</span>
        </div>
      ))}
    </div>
  );
}

const emptyDashboardData = {
  summary: {
    totalEmployees: 0,
    totalDepartments: 0,
    totalCourses: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    onLeaveEmployees: 0,
  },
  departmentDistribution: [],
  hiringTrend: [],
  courseCompletionStatus: [],
  popularCourses: [],
  activityFeed: [],
  recentTrainingCohorts: [],
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(emptyDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboard = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("You need to sign in again to view live dashboard data.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/dashboard`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        const data = await response.json();
        setDashboardData({
          summary: {
            ...emptyDashboardData.summary,
            ...(data.summary || {}),
          },
          departmentDistribution: Array.isArray(data.departmentDistribution) ? data.departmentDistribution : [],
          hiringTrend: Array.isArray(data.hiringTrend) ? data.hiringTrend : [],
          courseCompletionStatus: Array.isArray(data.courseCompletionStatus) ? data.courseCompletionStatus : [],
          popularCourses: Array.isArray(data.popularCourses) ? data.popularCourses : [],
          activityFeed: Array.isArray(data.activityFeed) ? data.activityFeed : [],
          recentTrainingCohorts: Array.isArray(data.recentTrainingCohorts) ? data.recentTrainingCohorts : [],
        });
        setError("");
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          console.error("Error fetching dashboard data:", fetchError);
          setError(fetchError.message || "Unable to load dashboard data.");
          setDashboardData(emptyDashboardData);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => controller.abort();
  }, []);

  const employeeStatus = [
    { name: "Active", value: dashboardData.summary.activeEmployees },
    { name: "Inactive", value: dashboardData.summary.inactiveEmployees },
    { name: "On Leave", value: dashboardData.summary.onLeaveEmployees },
  ].filter((item) => item.value > 0);

  const departmentBudgets = dashboardData.departmentDistribution.slice(0, 10).map(({ department, budget }) => ({
    department,
    budget,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 text-black">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto flex min-h-[60vh] max-w-[1600px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-10 shadow-sm">
              <div className="text-center">
                <p className="mt-3 text-2xl font-semibold text-gray-950">Loading live dashboard data...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 text-black">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto flex min-h-[60vh] max-w-[1600px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-10 shadow-sm">
              <div className="max-w-lg text-center">
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Dashboard unavailable</p>
                <p className="mt-3 text-2xl font-semibold text-gray-950">{error}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Make sure you are logged in and the backend is running with the dashboard endpoint enabled.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 text-left sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px] space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                icon={Users}
                label="Total Employees"
                value={dashboardData.summary.totalEmployees.toLocaleString("en-IN")}
                subtitle="Across all active departments"
                change="Live"
              />
              <KpiCard
                icon={Building2}
                label="Total Departments"
                value={dashboardData.summary.totalDepartments.toLocaleString("en-IN")}
                subtitle="Operational units"
                change="Live"
              />
              <KpiCard
                icon={GraduationCap}
                label="Total Courses"
                value={dashboardData.summary.totalCourses.toLocaleString("en-IN")}
                subtitle="Available learning programs"
                change="Live"
              />
              <KpiCard
                icon={UserCheck}
                label="Active Employees"
                value={dashboardData.summary.activeEmployees.toLocaleString("en-IN")}
                subtitle="Currently active workforce"
                change="Live"
                trend="down"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader
                  icon={ChartNoAxesColumnIncreasing}
                  title="Employee Distribution by Department"
                  subtitle="Headcount across all active departments"
                />
                <div className="h-[520px] p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.departmentDistribution} layout="vertical" margin={{ left: 24, right: 24 }}>
                      <CartesianGrid stroke="#e5e7eb" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis
                        dataKey="department"
                        type="category"
                        width={120}
                        tick={{ fill: "#374151", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
                      <Bar dataKey="employees" name="Employees" fill="#475569" radius={[0, 6, 6, 0]} isAnimationActive />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <CardHeader
                  icon={Users}
                  title="Monthly Hiring Trend"
                  subtitle="New hires across the last 12 months from employee creation dates"
                />
                <div className="h-[360px] p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.hiringTrend} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                      <CartesianGrid stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="hires"
                        name="Hires"
                        stroke="#334155"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#334155" }}
                        activeDot={{ r: 6 }}
                        isAnimationActive
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <CardHeader
                  icon={Activity}
                  title="Employee Status Distribution"
                  subtitle="Current workforce availability from live employee records"
                />
                <div className="grid min-h-[360px] gap-4 p-5 lg:grid-cols-[1fr_180px] lg:items-center">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={employeeStatus} innerRadius={72} outerRadius={108} paddingAngle={3} dataKey="value">
                          {employeeStatus.map((entry, index) => (
                            <Cell key={entry.name} fill={mutedPalette[index]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <DonutLegend data={employeeStatus} />
                </div>
              </Card>

              <Card>
                <CardHeader
                  icon={BookOpenCheck}
                  title="Course Completion Status"
                  subtitle="Training progress across all enrollments"
                />
                <div className="grid min-h-[360px] gap-4 p-5 lg:grid-cols-[1fr_180px] lg:items-center">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dashboardData.courseCompletionStatus} innerRadius={72} outerRadius={108} paddingAngle={3} dataKey="value">
                          {dashboardData.courseCompletionStatus.map((entry, index) => (
                            <Cell key={entry.name} fill={mutedPalette[index + 2]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <DonutLegend data={dashboardData.courseCompletionStatus} />
                </div>
              </Card>

              <Card>
                <CardHeader
                  icon={ClipboardList}
                  title="Top 10 Most Popular Courses"
                  subtitle="Sorted by live enrollment count"
                />
                <div className="h-[420px] p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.popularCourses} layout="vertical" margin={{ left: 32, right: 24 }}>
                      <CartesianGrid stroke="#e5e7eb" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis
                        dataKey="course"
                        type="category"
                        width={150}
                        tick={{ fill: "#374151", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
                      <Bar dataKey="enrollments" name="Enrollments" fill="#52525b" radius={[0, 6, 6, 0]} isAnimationActive />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <CardHeader
                  icon={IndianRupee}
                  title="Department Budget Allocation"
                  subtitle="Top department budgets in compact view"
                />
                <div className="h-[420px] p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentBudgets} margin={{ top: 16, right: 20, left: 8, bottom: 48 }}>
                      <CartesianGrid stroke="#e5e7eb" vertical={false} />
                      <XAxis
                        dataKey="department"
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(value) => formatCompact(value)}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value) => [formatCurrency(value), "Budget"]}
                        contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb" }}
                      />
                      <Bar dataKey="budget" name="Budget" fill="#78716c" radius={[6, 6, 0, 0]} isAnimationActive />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
