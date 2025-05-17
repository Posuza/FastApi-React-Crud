import React, { useEffect } from 'react'
import { useStore } from '../store/store'
import Breadcrumb from '../components/Breadcrumb'
import Container from '../components/Container'
import DataTable from '../components/ItemsTable'

const Items = () => {
  const fetchItems = useStore(state => state.fetchItems);
  const loading = useStore(state => state.itemsLoading);

  // Fetch items only once when component mounts
  useEffect(() => {
    fetchItems().catch(console.error);
  }, [fetchItems]);

  return (
    <section>
      <Container>
        <Breadcrumb 
          currentPage="Items" 
          
        />
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
          </div>
        ) : (
          <DataTable />
        )}
      </Container>
    </section>
  )
}

export default Items
