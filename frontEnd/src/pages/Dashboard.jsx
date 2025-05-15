import React from 'react'
import ModuleBtn from '../components/ModuleBtn'
import { AiFillProduct } from "react-icons/ai";
import { AiFillMedicineBox } from "react-icons/ai";
import { AiFillLayout } from "react-icons/ai";
import Container from '../components/container';

const Dashboard = () => {
  return (
    <section>
      <Container>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-1 gap-5 mt-12'>
          <div className="col-span-1 row-span-1 text-center text-sm mx-auto w-72">
            <ModuleBtn name={`Data Main`} icon={<AiFillProduct className='size-12'/>} url="/data-main" />
          </div>
          
        </div>
      </Container>
    </section>
  )
}

export default Dashboard