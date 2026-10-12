import { Box, Button, Card, Divider, Grid, Modal, Snackbar, TextField } from '@mui/material'
import React, { useState } from 'react'
import CartItem from './CartItem'
import AddressCard from './AddressCard'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { cartTotal } from './totalPay';
import { createOrder } from '../State/Order/Action';
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { isValid } from '../Util/ValidToOrder';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "secondary.main",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  streetAddress: "",
  state: "",
  pincode: "",
  city: ""
}
const validationSchema = Yup.object().shape({
  streetAddress: Yup.string()
    .trim()
    .required("Direccion Obligatoria"),
  state: Yup.string()
    .trim()
    .required("Provincia es Requerido"),
  pincode: Yup.string()
    .trim()
    .required("Codigo Postal Requerido")
    .matches(/^\d{4}$/, "Codigo postal solo de 4 digitos.Solo numeros"),
  city: Yup.string()
    .trim()
    .required("Ciudad Requerido"),
})

const Cart = () => {

  const createOrderUsingSelectedAddress = (item) => {
    const data = {
      jwt: localStorage.getItem("jwt"),
      order: {
        restaurantId: cart.cartItems[0].food?.restaurant.id,
        deliveryAddress: {
          id: item.id, // Send the ID of the existing address
          fullName: auth.user?.fullName,
          streetAddress: item.streetAddress,
          city: item.city,
          state: item.state,
          postalCode: item.postalCode,
          country: item.country || "Costa Rica",
        },
      },
    };

    if (isValid(cart.cartItems)) {
      dispatch(createOrder(data));
    } else {
      setOpenSnakbar(true);
    }
  };

  const [openSnackbar, setOpenSnakbar] = useState();
  const handleOpenAddressModal = () => setOpenAddressModal(true);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const { cart, auth } = useSelector(store => store)
  const dispatch = useDispatch()
  const handleCloseAddressModal = () => {
    setOpenAddressModal(false);
  };

  const handleSubmit = (values) => {
    const data = {
      jwt: localStorage.getItem("jwt"), //create-orders
      order: {
        restaurantId: cart.cartItems[0].food?.restaurant.id,
        deliveryAddress: {
          fullName: auth.user?.fullName,
          streetAddress: values.streetAddress,
          city: values.city,
          state: values.state,
          postalCode: values.pincode,
          country: values.country || "Costa Rica",
        },

      },
    }

    dispatch(createOrder(data))
    console.log("form value", values)
  };

  //calculate the total of the item
  const subtotal = cartTotal(cart.cartItems); //Item Total
  const iva = subtotal * 0.13;                //VAT(13%) 
  const totalPagar = subtotal + iva + 500 + 200;//Platform fee + Express

  const handleCloseSankBar = () => setOpenSnakbar(false);

  return (
    <>
      {/*address or add new address*/}
      {cart.cartItems.length > 0 ? (
        <main className='lg:flex justify-between'>
          {/**selected food */}
          <section className='lg:w-[30%] space-y-6 lg:min-h-screen pt-10'>
            {cart.cartItems.map((item) => (
              <CartItem item={item} />
            ))} {/**CartItem.jsx */}

            <Divider />

            {/**Bill Details */}
            <div className='billDetails px-5 text-sm"'>
              <p className='font-extralight py-5'>Detalles de la Factura</p>
              <div className='space-y-3'>
                <div className='flex justify-between text-white'>
                  <p>Total Articulo</p>
                  <p>₡{subtotal.toFixed(2)}</p>
                  {/* <p>₡ {cartTotal(cart.cartItems).toFixed(2)}</p> */}
                </div>
                <div className='flex justify-between text-white'>
                  <p>Express</p>
                  <p>₡500</p>
                </div>
                <div className='flex justify-between text-white'>
                  <p>Tasa de plataforma</p>
                  <p>₡200</p>
                </div>
                <div className='flex justify-between text-white'>
                  <p>IVA(13%)</p>  {/* Calculate 13% of the total item */}
                  <p>₡{iva.toFixed(2)}</p>
                </div>
                {/**total all payable */}
                <div className='flex justify-between text-white'>
                  <p>Total Pagar</p>
                  <p>₡{
                    totalPagar.toFixed(2)
                  }</p>
                  {/* <p>{cartTotal(cart.cartItems)}</p> */}
                </div>
              </div>
            </div>
          </section>

          <Divider orientation="vertical" flexItem />
          {/* delivery address */}
          <section className='lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0'>
            <div className=''>
              <h1 className="text-center font-semibold text-2xl py-10">
                Elije Direccion de Entrega
              </h1>
              <div className='flex gap-5 flex-wrap justify-center'>
                {/* {[1, 1, 1, 1, 1].map((item) => (<AddressCard */}
                {auth.user?.addresses.map((item, index) => (
                  <AddressCard
                    key={index}
                    handleSelectAddress={createOrderUsingSelectedAddress}
                    item={item}
                    showButton={true} />
                ))}

                {/**card add new address */}
                <Card className='flex space-x-5 w-64 p-5'>
                  <EditLocationAltIcon />

                  <div className="space-y-3 text-gray-500">
                    <h1 className="font-semibold text-lg text-white">Agregar Nueva Direccion</h1>

                    <Button
                      fullWidth onClick={handleOpenAddressModal}
                      variant="contained" //outlined
                      className="w-full" >
                      AGREGAR
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>

        </main>
      ) : (
        <div className="flex h-[90vh] justify-center items-center">
          <div className="text-center space-y-5">
            <RemoveShoppingCartIcon sx={{ width: "10rem", height: "10rem" }} />
            <p className="font-bold text-3xl">Tu carrito esta vacio</p>
          </div>
        </div>
      )}
      <Modal
        open={openAddressModal} onClose={handleCloseAddressModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/**box To add address information */}
        <Box sx={style}>
          <Formik initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            <Form>
              <Grid container spacing={2} sx={{ width: '100%' }}>
                {/* streetAddress               */}
                <Grid item size={12}>
                  <Field
                    name="streetAddress"
                    as={TextField}
                    label="Direccion"
                    fullWidth
                    variant="outlined"
                    sx={{ my: 0 }}
                    error={!ErrorMessage("streetAddress")}
                    helperText={
                      <ErrorMessage name="streetAddress">
                        {(msg) => <span className="text-red-300">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                {/* state */}
                <Grid item size={6}>
                  <Field
                    name="state"
                    as={TextField}
                    label="Provincia"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("state")}
                    helperText={
                      <ErrorMessage name="state">
                        {(msg) => <span className="text-red-300">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                {/* pincode */}
                <Grid item size={6}>
                  <Field
                    name="pincode"
                    as={TextField}
                    label="Codigo Postal"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("pincode")}
                    helperText={
                      <ErrorMessage name="pincode">
                        {(msg) => <span className="text-red-300">{msg}</span>}
                      </ErrorMessage>
                    }

                  />
                </Grid>
                {/* city */}
                <Grid item size={12}>
                  <Field
                    name="city"
                    as={TextField}
                    label="Ciudad"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("city")}
                    helperText={
                      <ErrorMessage name="city">
                        {(msg) => <span className="text-red-300">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                {/* submit */}
                <Grid item size={12} >
                  <Button type='submit' variant="contained" color="primary">
                    Entregar Aqui
                  </Button>
                </Grid>

              </Grid>
            </Form>

          </Formik>
        </Box>
      </Modal>

      <Snackbar
        severity="success"
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSankBar}
        message="Por favor agrega Tu pedido de un Restaurante a la VEZ"
      />
    </>
  )
}

export default Cart