import React, { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import { Route, Routes } from 'react-router-dom'
import Orders from '../Orders/Orders'
import Menu from '../Menu/Menu'
import FoodCategory from '../FoodCategory/FoodCategory'
import Ingredients from '../Ingredients/Ingredients'
import Events from '../Events/Events'
import RestaurantDetails from './RestaurantDetails'
import RestaurantDashboard from '../Dashboard/RestaurantDashboard'
import AddMenuForm from '../Menu/AddMenuForm'
import SeeReport from '../Reports/Reportes'
import { useDispatch, useSelector } from 'react-redux'
import { getIngredientCategory, getIngredientsOfRestaurant } from '../../components/State/Ingredients/Action'
import { getRestaurantsCategory } from '../../components/State/Restaurant/Action'
import { fetchRestaurantsOrder } from '../../components/State/RestaurantOrder/restaurants.order.action'


const Admin = () => {
   const dispatch = useDispatch();
  const [openSideBar, setOpenSideBar] = useState(false);
  const handleOpenSideBar = () => setOpenSideBar(true);
  const handleCloseSideBar = () => setOpenSideBar(false);
  const { auth, restaurant, ingredients } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  // const handleCloseSideBar = () => {

  // }

    useEffect(() => {
    if (restaurant.usersRestaurant) {
      dispatch(
        getIngredientCategory({ jwt, id: restaurant.usersRestaurant?.id })
      );
      dispatch(
        getIngredientsOfRestaurant({ jwt, id: restaurant.usersRestaurant?.id })
      );
      dispatch(
        getRestaurantsCategory({
          jwt: auth.jwt || jwt,
          restaurantId: restaurant.usersRestaurant?.id,
        })
      );

      dispatch(
        fetchRestaurantsOrder({
          restaurantId: restaurant.usersRestaurant?.id,
          jwt: auth.jwt || jwt,
        })
      );
    }
  }, [restaurant.usersRestaurant]);

  return (
    <div>
{/* OPTIONS AdminSidebar */}
      <div className="lg:flex justify-between">
        <div  className='sticky h-[80vh] lg:w-[20%]'> {/**className='sticky h-[80vh] lg:w-[20%]' */}

          <AdminSidebar handleClose={handleCloseSideBar} open={openSideBar}/>
        </div>

        {/* options options     */}
        <div className="lg:w-[80%]">
          <Routes>
            <Route path='/' element={<RestaurantDashboard/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/menu' element={<Menu/>}/>
            <Route path='/category' element={<FoodCategory/>}/>
            <Route path='/ingredients' element={<Ingredients/>}/>
            <Route path='/event' element={<Events/>}/>
            <Route path='/details' element={<RestaurantDetails/>}/>
            <Route path='/add-menu' element={<AddMenuForm/>}/>
            <Route path='/reports' element={<SeeReport/>}/>
            
          </Routes>

        </div>
      </div>
    </div>
  )
}

export default Admin
