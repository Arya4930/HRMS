export default function Navbar({ title }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-bold !text-black text-left">{title}</h2>
        <p className="text-slate-500 text-sm mt-1">Fill and manage your HRMS details</p>
      </div>

    </div>
  );
}