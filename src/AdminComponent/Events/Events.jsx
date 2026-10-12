import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Modal, TextField } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { createEventAction, getRestaurnatsEvents } from '../../components/State/Restaurant/Action';

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


import EventCard from './EventCard';


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
  image: "",
  location: "",
  name: "",
  startedAt: null,
  endsAt: null,
};
const initialErrors = {
  image: "",
  location: "",
  name: "",
  startedAt: "",
  endsAt: "",
};


const Events = () => {

  const [image, setimage] = useState("");
  const dispatch = useDispatch();
  const { restaurant, auth } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = () => setOpenModal(true);
  const jwt = localStorage.getItem("jwt");

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);


  const validateForm = () => {

    let isValid = true;

    const newErrors = { ...initialErrors };

    if (!formValues.image.trim()) {
      newErrors.image = "Campo Requerido";
      isValid = false;
    } else if (!/^https?:\/\/.+\..+/.test(formValues.image)) {
      newErrors.image = "Ingrese una URL válida";
      isValid = false;
    }

    if (!formValues.location.trim()) {
      newErrors.location = "Campo Requerido";
      isValid = false;
    }

    // Validation for promotion name
    if (!formValues.name.trim()) {
      newErrors.name = "Campo Requerido";
      isValid = false;
    }

   // Validation for start date
    if (!formValues.startedAt || !dayjs(formValues.startedAt).isValid()) {
      newErrors.startedAt = "La fecha de inicio es requerida";
      isValid = false;
      console.log("Error en startedAt"); // Debug
    }

    // Validación para fecha de finalización
    if (!formValues.endsAt || !dayjs(formValues.endsAt).isValid()) {
      newErrors.endsAt = "La fecha de finalización es requerida";
      isValid = false;
    } else if (
      dayjs(formValues.startedAt).isValid() &&
      dayjs(formValues.endsAt).isValid() &&
      formValues.endsAt.isBefore(formValues.startedAt)
    ) {
      newErrors.endsAt = "La fecha de finalización debe ser posterior a la de inicio";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleDateChange = (date, dateType) => {
    //format("MMMM DD, YYYY hh:mm A");
    const formattedDate = dayjs(date);
    setFormValues({ ...formValues, [dateType]: formattedDate });

    // Limpiar error cuando el usuario escribe
    if (errors[dateType]) {
      setErrors({ ...errors, [dateType]: "" });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(
      createEventAction({
        data: formValues,
        restaurantId: restaurant.usersRestaurant?.id,
        jwt
      })
    );
    console.log("Image URL:", formValues, restaurant.usersRetaurant?.id);
    setFormValues(initialValues);
    handleCloseModal();
  };

  useEffect(() => {
    if (restaurant.usersRestaurant) {
      dispatch(
        getRestaurnatsEvents({
          restaurantId: restaurant.usersRestaurant?.id,
          jwt: auth.jwt || jwt,
        })
      );
    }
  }, [restaurant.usersRestaurant]);

  return (
    <div>

      <div className="p-5">
        <Button
          sx={{ padding: "1rem 2rem" }}
          onClick={handleOpenModal}
          variant="contained"
          color="primary"
        >
          Crear Nueva Promocion
        </Button>
      </div>

      <div className="mt-5 px-5 flex flex-wrap gap-5">
        {restaurant.restaurantsEvents.map((item) => (
          <EventCard item={item} />
        ))}
        {/* <div>
          <img
          className="rounded-md w-[25rem] h-[25-rem] object-cover"
            src="https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt=""
          />
        </div> */}
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item size={12}>
                <TextField
                  name="image"
                  label="Imagen URL"
                  variant="outlined"
                  fullWidth
                  value={formValues.image}
                  onChange={handleFormChange}
                  error={!!errors.image}
                  helperText={errors.image}
                  sx={{
                    '& .MuiFormHelperText-root.Mui-error': {
                      color: '#fee2e2'
                    }
                  }}
                />
              </Grid>
              <Grid item size={12}>
                <TextField
                  name="location"
                  label="Ubicacion"
                  variant="outlined"
                  fullWidth
                  value={formValues.location}
                  onChange={handleFormChange}
                  error={!!errors.location}
                  helperText={errors.location}
                  sx={{
                    '& .MuiFormHelperText-root.Mui-error': {
                      color: '#fee2e2'
                    }
                  }}
                />
              </Grid>
              <Grid item size={12}>
                <TextField
                  name="name"
                  label="Nombre Promocion"
                  variant="outlined"
                  fullWidth
                  value={formValues.name}
                  onChange={handleFormChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{
                    '& .MuiFormHelperText-root.Mui-error': {
                      color: '#fee2e2'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Fecha y Hora de Inicio"
                    value={formValues.startedAt}
                    onChange={(newValue) => handleDateChange(newValue, "startedAt")}
                    inputFormat="MM/dd/yyyy hh:mm a"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startedAt,
                        helperText: errors.startedAt,
                        sx: {
                          '& .MuiFormHelperText-root': {
                            color: '#fee2e2'
                          }
                        }
                      }
                    }}
                  />

                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Fecha y Hora de Finalización"
                    value={formValues.endsAt}
                    onChange={(newValue) => handleDateChange(newValue, "endsAt")}
                    inputFormat="MM/dd/yyyy hh:mm a"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endsAt,
                        helperText: errors.endsAt,
                        sx: {
                          '& .MuiFormHelperText-root': {
                            color: '#fee2e2'
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button variant="contained" color="primary" type="submit">
                Crear
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default Events
