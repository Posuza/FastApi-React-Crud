import React, { useState, useMemo, useEffect } from "react";
import { useDataTableStore } from '../store/useDataTableStore';
import { MdDelete, MdEdit } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const mockRows = [
    {
        id: 1,
        employeeName: "John Doe",
        age: 28,
        department: "Engineering",
        township: "Downtown",
        location: "bangladesh",
    },
    {
        id: 2,
        employeeName: "Jane Smith",
        age: 34,
        department: "Marketing",
        township: "Uptown",
    },
    {
        id: 3,
        employeeName: "Alice Johnson",
        age: 45,
        department: "Human Resources",
        township: "Westside",
        extraField: "Extra Value"
    },
    {
        id: 4,
        employeeName: "Bob Lee",
        age: 39,
        department: "Finance",
        township: "Lakeside",
    },
];

const DataTable = () => {
    const rows = useDataTableStore((state) => state.rows);
    const setRows = useDataTableStore((state) => state.setRows);
    const updateRow = useDataTableStore((state) => state.updateRow);
    const deleteRow = useDataTableStore((state) => state.deleteRow);
    const fetchFakeApi = useDataTableStore((state) => state.fetchFakeApi);

    const [editRow, setEditRow] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const rowsPerPage = 2;

    useEffect(() => {
        if (!rows || rows.length === 0) {
            fetchFakeApi();
        }
    }, [rows, fetchFakeApi]);

    // Get all unique keys from all rows (excluding 'id')
    const columns = useMemo(() => {
        const colSet = new Set();
        rows.forEach(row => {
            Object.keys(row).forEach(key => {
                if (key !== "id") colSet.add(key);
            });
        });
        return Array.from(colSet);
    }, [rows]);

    // Filter rows based on search
    const filteredRows = useMemo(() => {
        if (!search) return rows;
        return rows.filter(row =>
            Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [rows, search]);

    // Calculate paginated rows from filteredRows
    const paginatedRows = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredRows.slice(start, start + rowsPerPage);
    }, [filteredRows, currentPage]);

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    // Reset to first page if rows change and current page is out of range
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [rows, totalPages]);

    const handleEdit = (row) => setEditRow({ ...row });

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditRow((prev) => ({
            ...prev,
            [name]: name === "age" ? Number(value) : value,
        }));
    };

    // Add this function to create an empty row based on current columns
    const handleCreate = () => {
        const newRow = { id: Date.now() };
        columns.forEach(col => {
            newRow[col] = "";
        });
        setEditRow(newRow);
    };

    // Modify handleEditSave to add or update
    const handleEditSave = () => {
        if (!editRow.id || !rows.find(r => r.id === editRow.id)) {
            // New row
            setRows([...rows, { ...editRow, id: Date.now() }]);
        } else {
            // Existing row
            updateRow(editRow);
        }
        setEditRow(null);
    };

    const handleEditCancel = () => setEditRow(null);

    const handleDelete = (row) => {
        setRowToDelete(row);
        setShowDelete(true);
    };

    const confirmDelete = () => {
        deleteRow(rowToDelete.id);
        setShowDelete(false);
        setRowToDelete(null);
    };

    const cancelDelete = () => {
        setShowDelete(false);
        setRowToDelete(null);
    };

    return (
        <>
            {/* Search Bar and Create Product Button */}
            <div className="flex justify-between mb-4 items-center">
                <input
                    type="text"
                    className="border px-3 py-2 rounded w-64"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={handleCreate}
                >
                    Create Product
                </button>
            </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

            {/* Edit Modal */}
            {editRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Edit Employee</h2>
                        {columns.map((col) => (
                            <div className="mb-2" key={col}>
                                <label className="block mb-1 capitalize">
                                    {col.replace(/([A-Z])/g, " $1")}
                                </label>
                                <input
                                    className="border px-2 py-1 w-full"
                                    name={col}
                                    type={typeof editRow[col] === "number" ? "number" : "text"}
                                    value={editRow[col] ?? ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                        ))}
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={handleEditCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={handleEditSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation */}
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4 text-red-600">
                            Delete Confirmation
                        </h2>
                        <p className="mb-4">
                            Are you sure you want to delete{" "}
                            <b>{rowToDelete.employeeName}</b>?
                        </p>
                        <div className="flex justify-end items-center h-full gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-white uppercase bg-sky-700">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                scope="col"
                                className={`px-6 py-3 ${typeof rows[0]?.[col] === "number" ? "text-right" : ""}`}
                            >
                                {col
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-right">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedRows.map((row) => (
                        <tr
                            key={row.id}
                            className="bg-white border-b border-gray-200 hover:bg-gray-50"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col}
                                    className={`px-6 py-4 ${typeof row[col] === "number" ? "text-right" : ""}`}
                                >
                                    {typeof row[col] === "object" && row[col] !== null
                                        ? ""
                                        : row[col] ?? ""}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                <button
                                    className="font-medium text-blue-600 hover:underline"
                                    onClick={() => handleEdit(row)}
                                >
                                    <MdEdit className="text-xl" />
                                </button>
                                <button
                                    className="font-medium text-red-600 hover:underline"
                                    onClick={() => handleDelete(row)}
                                >
                                    <MdDelete className="text-xl" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-4  ">
                <button
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <FaArrowLeftLong className="text-xl" />
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    <FaArrowRightLong className="text-xl" />
                </button>
            </div>
        </>
    );
};

export default DataTable;
