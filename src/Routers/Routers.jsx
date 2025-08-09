import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminRouters from './AdminRouters'
import CustomerRouter from "./CustomerRouter"
import ProtectedRoute from './ProtectedRoute'

const Routers = () => {
  return (
    <div>
      <Routes>

        <Route
          path="/admin/restaurants/*"
          // element={<AdminRouters/>} sin protected
          element={
            <ProtectedRoute requiredRole="ROLE_RESTAURANT_OWNER">
              <AdminRouters />
            </ProtectedRoute>
          }
        />

        <Route path="/*" element={
          <CustomerRouter />  
          } />
      </Routes>

    </div>
  )
}

export default Routers
