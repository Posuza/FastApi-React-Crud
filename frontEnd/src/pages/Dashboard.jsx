import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import ModuleBtn from '../components/ModuleBtn';
import { ImUserTie } from "react-icons/im";
import Container from '../components/Container';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);


  if (!user) return null;

  return (
    <section>
      <Container>
        {/* Module Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-1 gap-5 mt-12'>
          <div className="col-span-1 row-span-1 text-center text-sm mx-auto w-72">
            <ModuleBtn 
              name="Items" 
              icon={<ImUserTie className='size-16'/>} 
              url="/items"
            />
          </div>
          {/* <div className="col-span-1 row-span-1 text-center text-sm mx-auto w-72">
            <ModuleBtn 
              name="Employee Data" 
              icon={<AiFillLayout className='size-16'/>} 
              url="/employee-data" 
            />
          </div> */}
        </div>
      </Container>
    </section>
  );
};

export default Dashboard;

