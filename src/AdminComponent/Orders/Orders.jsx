import { Card, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import OrderTable from './OrderTable';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsOrder } from '../../components/State/RestaurantOrder/restaurants.order.action';

const orderStatus = [
  { label: "Pendiente", value: "PENDIENTE" },
  { label: "Completado", value: "COMPLETADO" },
  { label: "Todo", value: "all" },
];

const Orders = () => {

   const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");
  const { restaurant, auth } = useSelector((store) => store);

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const filterValue = searchParams.get("order_status");

useEffect(() => {
    dispatch(
      fetchRestaurantsOrder({
        restaurantId: restaurant.usersRestaurant?.id,
        orderStatus: filterValue,
        jwt: auth.jwt || jwt,
      })
    );
  }, [auth.jwt, filterValue]);

  const handleFilter = (e, value) => {
    const searchParams = new URLSearchParams(location.search);

    if (value === "all") {
      searchParams.delete("order_status");
    } else searchParams.set("order_status", e.target.value);

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  return (
    <div className='px-2'>
{/* Status */}
      <Card className='p-5'>
        <Typography sx={{ paddingBottom: "1rem" }} variant='h5'>
          Estado de Ordenes
        </Typography>
        <FormControl>
          <RadioGroup 
          row name='category' 
          value={filterValue ? filterValue : "all"}
            onChange={handleFilter}>

            {orderStatus.map((item, index) => (
              <FormControlLabel
                key={index}
                value={item.value}
                control={<Radio />}
                label={item.label}
                sx={{ color: "gray" }}
              />
            ))}

          </RadioGroup>
        </FormControl>

      </Card>


{/* OrderTable */}
     <OrderTable name={"Todas  las Ordenes"} />

    </div>
  )
}

export default Orders
