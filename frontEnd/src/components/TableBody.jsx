import React from "react";

const TableBody = ({ data, onEdit, onDelete }) => {
  return (
    <>
      {data.map((row) => (
        <tr key={row.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {row.employeeName}
          </th>
          <td className="px-6 py-4 text-right">{row.age}</td>
          <td className="px-6 py-4">{row.department}</td>
          <td className="px-6 py-4">{row.township}</td>
          <td className="px-6 py-4 text-right flex gap-2 justify-end">
            <button
              className="font-medium text-blue-600 hover:underline"
              onClick={() => onEdit(row)}
            >
              Edit
            </button>
            <button
              className="font-medium text-red-600 hover:underline"
              onClick={() => onDelete(row)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableBody;