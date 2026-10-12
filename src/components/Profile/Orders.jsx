import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersOrders } from '../State/Order/Action'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Divider } from '@mui/material'

const Orders = () => {
  const { auth, order } = useSelector(store => store)
  const jwt = localStorage.getItem("jwt")
  const dispatch = useDispatch()
  const [showSummary, setShowSummary] = useState(false)
  const [restaurantTotals, setRestaurantTotals] = useState({})

  useEffect(() => {
    dispatch(getUsersOrders(jwt))
  }, [auth.jwt])

  // Function to format numbers with thousands separators
  const formatNumber = (number) => {
    
    return number.toLocaleString('es-CR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Calculate totals per restaurant
  const calculateRestaurantTotals = () => {
    const totals = {}
    
    order.orders.forEach(order => {
      const restaurantId = order.items[0]?.food?.restaurant?.id
      const restaurantName = order.items[0]?.food?.restaurant?.name || 'Restaurante Desconocido'
      
      if (!restaurantId) return
      
      const orderTotal = order.items.reduce((sum, item) => sum + (item.food.price * item.quantity), 0)
      
      if (!totals[restaurantId]) {
        totals[restaurantId] = {
          name: restaurantName,
          total: 0,
          count: 0
        }
      }
      
      totals[restaurantId].total += orderTotal
      totals[restaurantId].count += 1
    })
    
    setRestaurantTotals(totals)
  }

  const handleShowSummary = () => {
    calculateRestaurantTotals()
    setShowSummary(true)
  }

  return (
    <div className='flex items-center flex-col'>
      <h1 className='text-xl text-center py-7 font-semibold'>Mis Ordenes</h1>

      <div className='space-y-5 w-full lg:w-1/2'>
  {order.orders.map((orderItem, index) => (
    <OrderCard 
      key={orderItem.id || index}
      status={orderItem.orderStatus} 
      order={orderItem} // PASS the entire order, not the item
    />
  ))}
</div>
{/* Button to show summary */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleShowSummary}
        sx={{ mt: 4, mb: 2 }}
      >
        Ver Resumen de Pagos
      </Button>

{/* Modal with summary */}
      <Dialog open={showSummary} onClose={() => setShowSummary(false)}>
        <DialogTitle>Resumen de Pagos por Restaurante</DialogTitle>
        <DialogContent>
          {Object.keys(restaurantTotals).length > 0 ? (
            Object.entries(restaurantTotals).map(([id, data]) => (
              <div key={id} style={{ marginBottom: '16px' }}>
                <Typography variant="h6">{data.name}</Typography>
                <Typography>
                  Órdenes: {data.count} | Total pagado: ₡{formatNumber(data.total)}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </div>
            ))
          ) : (
            <Typography>No hay datos disponibles</Typography>
          )}
          
          {/* Formatted grand total */}
          {Object.keys(restaurantTotals).length > 0 && (
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total general: ₡{formatNumber(
                Object.values(restaurantTotals)
                  .reduce((sum, data) => sum + data.total, 0)
              )}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSummary(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Orders