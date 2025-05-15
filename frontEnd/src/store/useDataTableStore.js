import { create } from 'zustand';

export const useDataTableStore = create((set) => ({
    rows: [],
    setRows: (rows) => set({ rows }),
    updateRow: (updatedRow) =>
        set((state) => ({
            rows: state.rows.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            ),
        })),
    deleteRow: (id) =>
        set((state) => ({
            rows: state.rows.filter((row) => row.id !== id),
        })),
    fetchFakeApi: async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/items/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await res.json();
            set({ rows: data });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
}));