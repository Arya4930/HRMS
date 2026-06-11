export default function InputField({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </span>
      <input
        {...props}
        className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-slate-900 ${props.className || ""}`}
      />
    </label>
  );
}