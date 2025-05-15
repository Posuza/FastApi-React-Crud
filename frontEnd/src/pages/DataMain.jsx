import React from 'react'
import Breadcrumb from '../components/breadcrumb'
import Container from '../components/container'
import DataTable from '../components/DataTable'

const DataMain = () => {
  return (
    <section>
      <Container>
        <Breadcrumb currentPage={"Data Main"}/>
        <DataTable />
      </Container>
    </section>
  )
}

export default DataMain
