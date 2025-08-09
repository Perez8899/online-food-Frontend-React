import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Home from '../components/Home/Home'
import Cart from '../components/Cart/Cart'
import RestaurantDetails from '../components/Restaurant/RestaurantDetails'
import Profile from '../components/Profile/Profile'
import Auth from '../components/Auth/Auth'
import PaymentSuccess from '../components/PaymentSuccess/PaymentSuccess'
import Search from '../components/Search/Search'
import CreaterRestaurantForm from '../AdminComponent/CreateRestaurantForm/CreaterRestaurantForm'
import ProtectedRoute from './ProtectedRoute'

const CustomerRouter = () => {
  return (
    <div className='relative'>
      <nav className='sticky top-0 z-50'>
        <Navbar />
      </nav>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/account/:register' element={<Home />} />
        <Route exact path='/restaurant/:city/:title/:id' element={<RestaurantDetails />} />
        <Route path='/cart' element={<Cart />} />
        {/* <Route path='/my-profile/*' element={<Profile />} />*/}
        <Route
          path='/my-profile/*'
          element={
            // <ProtectedRoute requiredRole="ROLE_CUSTOMER">
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path='/payment/success/:id' element={<PaymentSuccess />} />'

        {/* Admin only */}
        <Route
          path='/admin/add-restaurant'
          element={
            <ProtectedRoute requiredRole='ROLE_RESTAURANT_OWNER'>
              <CreaterRestaurantForm />
            </ProtectedRoute>
          }
        />

        <Route path='/search' element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } />

      </Routes>
      <Auth />
    </div>
  )
}

export default CustomerRouter
