import React from 'react'
import { Route, Routes } from "react-router-dom";
import CreaterRestaurantForm from '../AdminComponent/CreateRestaurantForm/CreaterRestaurantForm';
import Admin from '../AdminComponent/Admin/Admin';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar/Navbar';

const AdminRouters = () => {

  const { auth, restaurant } = useSelector((store) => store);

  return (
    <div className='relative'>
      {/* <nav className='fixed top-0 left-0 right-0 z-50'>
        <Navbar />
      </nav> */}
      <div className='pt-1'>
        <Routes>
          <Route
            path="/*"
            
            element={

              !restaurant.usersRestaurant ? (
                <CreaterRestaurantForm />
              ) : (
                <Admin />
              )
            }
          />
        </Routes>
      </div>

    </div >
  )
}

export default AdminRouters
