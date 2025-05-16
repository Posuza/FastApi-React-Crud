export interface Item {
    id: number;
    name: string;
    description?: string;
}

export interface DataTableState {
    rows: Item[];
    loading: boolean;
    error: string | null;
    fetchItems: () => Promise<void>;
    createItem: (newItem: Omit<Item, 'id'>) => Promise<Item>;
    updateItem: (id: number, data: Partial<Item>) => Promise<Item>;
    deleteItem: (id: number) => Promise<void>;
    clearError: () => void;
}