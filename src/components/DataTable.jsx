export default function DataTable({ columns, data }) {
  return (
    <div className="overflow-hidden border rounded-2xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left px-4 py-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="border-t">
                {Object.values(row).map((value, i) => (
                  <td key={i} className="px-4 py-3">
                    {value}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-6 text-slate-500" colSpan={columns.length}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}