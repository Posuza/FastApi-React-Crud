import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from '../store/store';
import { MdDelete, MdEdit } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { IoPersonAddSharp } from "react-icons/io5";


const DataTable = () => {
    const navigate = useNavigate();
    // Separate store selectors to prevent unnecessary re-renders
    const user = useStore(state => state.user);
    const items = useStore(state => state.items);
    const itemsLoading = useStore(state => state.itemsLoading);
    const itemsError = useStore(state => state.itemsError);
    const fetchItems = useStore(state => state.fetchItems);
    const createItem = useStore(state => state.createItem);
    const updateItem = useStore(state => state.updateItem);
    const deleteItem = useStore(state => state.deleteItem);

    const [editRow, setEditRow] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showValidationError, setShowValidationError] = useState(false);
    const rowsPerPage = 8;

    // Fetch items only when component mounts or user changes
    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }
        
        const loadItems = async () => {
            try {
                await fetchItems();
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        };
        
        loadItems();
    }, [user, navigate]); // Remove fetchItems from dependencies

    // Get all unique keys from all rows (excluding 'id')
    const columns = useMemo(() => {
        const colSet = new Set();
        items.forEach(row => {
            Object.keys(row).forEach(key => {
                if (key !== "id") colSet.add(key);
            });
        });
        return Array.from(colSet);
    }, [items]);

    // Filter rows based on search
    const filteredRows = useMemo(() => {
        if (!search) return items;
        return items.filter(row =>
            Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [items, search]);

    // Calculate paginated rows from filteredRows
    const paginatedRows = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredRows.slice(start, start + rowsPerPage);
    }, [filteredRows, currentPage]);

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    // Reset to first page if rows change and current page is out of range
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [items, totalPages]);

    const handleEdit = (row) => setEditRow({ ...row });

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditRow((prev) => ({
            ...prev,
            [name]: name === "age" ? Number(value) : value,
        }));
    };

    // Modify handleCreate to use the store's createItem
    const handleCreate = () => {
        const newRow = { 
            name: "",
            description: ""
        };
        setEditRow(newRow);
    };

    // Add validation check function
    const validateForm = () => {
        return editRow?.name?.trim() && editRow?.description?.trim();
    };

    // Update handleEditSave
    const handleEditSave = async () => {
        if (!validateForm()) {
            setShowValidationError(true);
            return;
        }

        try {
            if (!editRow.id) {
                // Create new item
                await createItem(editRow);
            } else {
                // Update existing item
                await updateItem(editRow.id, editRow);
            }
            setEditRow(null);
        } catch (error) {
            alert("Failed to save item.");
        }
    };

    const handleEditCancel = () => setEditRow(null);

    const handleDelete = (e, row) => {
        e.stopPropagation(); // Prevent row click event
        setRowToDelete(row);
        setShowDelete(true);
    };

    // Update confirmDelete to use the store's deleteItem
    const confirmDelete = async () => {
        try {
            await deleteItem(rowToDelete.id);
            setShowDelete(false);
            setRowToDelete(null);
            // Remove fetchItems call since the store already updates the state
        } catch (error) {
            console.error('Delete error:', error);
            alert(error.message || "Failed to delete item.");
        }
    };

    const cancelDelete = () => {
        setShowDelete(false);
        setRowToDelete(null);
    };

    if (itemsError) {
        return <div className="text-red-600 p-4">Error: {itemsError}</div>;
    }

    // Update the return statement to handle loading
    return (
        <>
            {itemsLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
                </div>
            )}

            {/* Search Bar and Create Product Button */}
            <div className="flex justify-between mb-4 items-center">
                <input
                    type="text"
                    className="border-2 border-stone-300 px-3 py-2 rounded-md w-64  outline-transparent focus:outline-sky-700"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button
                    className="flex gap-2 items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 active:scale-95  transition duration-300"
                    onClick={handleCreate}
                >
                   <IoPersonAddSharp size={20}/> Create New Employee 
                </button>
            </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

            {/* Edit Modal */}
            {editRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30  transition-all">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold text-sky-700 mb-4">
                            {editRow.id ? 'Edit' : 'Create New'} Employee
                        </h2>
                        {columns.map((col) => (
                            <div className="mb-4" key={col}>
                                <label className="block  text-sky-800 mb-1 capitalize">
                                    {col.replace(/([A-Z])/g, " $1")}
                                    {/* <span className="text-red-500 ml-1">*</span> */}
                                </label>
                                <input
                                    className={`border rounded-lg px-2 py-2 w-full ${
                                        !editRow[col]?.trim() ? 'border-gray-300 outline-transparent focus:outline-sky-700' : 'border-gray-300'
                                    }`}
                                    name={col}
                                    type={typeof editRow[col] === "number" ? "number" : "text"}
                                    value={editRow[col] ?? ""}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                        ))}
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 active:scale-95 rounded"
                                onClick={handleEditCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-sky-800 hover:bg-sky-900 active:scale-95 text-white rounded"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30  transition-all">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-4 text-red-600">
                            <MdDelete size={24}/> Delete Confirmation
                        </h2>
                        <p className="mb-4">
                            Are you sure you want to delete{" "}
                            <b>{rowToDelete?.name || 'this item'}</b>?
                        </p>
                        <div className="flex justify-end items-center h-full gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 active:scale-95"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Validation Error Modal */}
            {showValidationError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30  transition-all">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-4 text-sky-700">
                            <MdEdit size={24}/> Validation Error
                        </h2>
                        <p className="mb-4">
                            Please fill in all required fields:
                            <ul className="list-disc ml-6 mt-2 text-gray-600">
                                {!editRow?.name?.trim() && (
                                    <li>Employee name is required</li>
                                )}
                                {!editRow?.description?.trim() && (
                                    <li>Description is required</li>
                                )}
                            </ul>
                        </p>
                        <div className="flex justify-end items-center h-full">
                            <button
                                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 active:scale-95 text-white rounded"
                                onClick={() => setShowValidationError(false)}
                            >
                                OK
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
                                className={`px-6 py-3 ${typeof items[0]?.[col] === "number" ? "text-right" : ""}`}
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
                            className="bg-white border-b border-gray-200 hover:bg-gray-50 w-full cursor-pointer"
                            onClick={() => navigate(`/product/${row.id}`)}
                        >
                            {columns.map((col) => (
                                <td
                                    key={col}
                                    className={`px-6 py-4 ${typeof row[col] === "number" ? "text-right" : ""}`}
                                    onClick={e => e.stopPropagation()} // Prevent row click when clicking inside cell
                                >
                                    {col === "image" && typeof row[col] === "string" ? (
                                        <img src={row[col]} alt="product" className="h-12 w-12 object-contain mx-auto" />
                                    ) : typeof row[col] === "object" && row[col] !== null ? (
                                        ""
                                    ) : (
                                        row[col] ?? ""
                                    )}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                                <div className="flex inline-block justify-  h-full">
                                    <button
                                        className="font-medium text-blue-600 hover:underline hover:bg-gray-100 p-3 active:scale-95 border-gray-200 border rounded-l-lg"
                                        onClick={e => { e.stopPropagation(); handleEdit(row); }}
                                    >
                                        <MdEdit className="text-xl" />
                                    </button>
                                    <button
                                        className="font-medium text-red-600 hover:underline hover:bg-gray-200 p-3 active:scale-95 border-gray-200 border rounded-r-lg"
                                        onClick={(e) => handleDelete(e, row)}
                                    >
                                        <MdDelete className="text-xl" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 my-6  ">
                <button
                    className="px-3 py-1 bg-white shadow hover:bg-gray-100 active:bg-gray-200 duration-500 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <FaArrowLeftLong className="text-xl text-sky-800" />
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="px-3 py-1 bg-white shadow hover:bg-gray-100 active:bg-gray-200 duration-500 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    <FaArrowRightLong className="text-xl text-sky-800" />
                </button>
            </div>
        </>
    );
};

export default DataTable;
