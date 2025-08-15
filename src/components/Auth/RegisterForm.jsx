import { Button, Container, CssBaseline, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../State/Authentication/Action';
import * as Yup from "yup";

//initial values
const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: "ROLE_CUSTOMER",
};

//validation of registration fields
const validationSchema = Yup.object({
  fullName: Yup.string()
  .trim()
  .required("Nombre es Requerido"),
  email: Yup.string()
   .trim()
    .email("Invalido Formato  de Email")
    .required("Email es Requerido"),
  password: Yup.string()
   .trim()
           .min(8, "La Contraseña debe tener al menos 8 caracteres")
           .required("Contraseña es Requerida"),
      role: Yup.string().required("Tipo es requerido"),
});


const RegisterForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handelSubmit = (values) => {
    console.log("Form Values", values);
    dispatch(registerUser({ userData: values, navigate }))
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div>
      <Typography className="text-center " variant="h5">
        Registrarse
      </Typography>

      <Formik initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelSubmit}>

        <Form>
          {/**FULL NAME */}
          <Field
            as={TextField}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Nombre Apellido"
            name="fullName"
            id="fullName"
            autoComplete="fullName"
            helperText={<ErrorMessage name="fullName" />}
          />
          {/**EMAIL*/}
          <Field
            as={TextField}
            margin="normal"
            variant="outlined"
            fullWidth
            label="Email"
            name="email"
            autoComplete="email"
            helperText={<ErrorMessage name="email" />}
          />
          {/**PASSWORD */}
          <Field
            as={TextField}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            id="password"
            helperText={<ErrorMessage name="password" />}
          />

          {/**ROLE*/}
          <FormControl fullWidth margin="normal">
            <InputLabel id='demo-simple-select-select-label'>Roll</InputLabel>
            <Field
              className="mt-3"
              as={Select}
              variant="outlined"
              fullWidth
              name="role"
              id="role"
              helperText={<ErrorMessage name="role" />}
            >
              <MenuItem value="ROLE_CUSTOMER">Cliente</MenuItem>
              <MenuItem value="ROLE_RESTAURANT_OWNER">Dueno Restaurante</MenuItem>
            </Field>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Registrarse
          </Button>
        </Form>

      </Formik>

      {/** Don\'t have an account? , send it to registration*/}
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 3 }}>
        {'Ya tienes una cuenta? '}
        <Button>
          <Button onClick={() => navigate("/account/login")}>
            Login
          </Button>
        </Button>
      </Typography>
    </div>
    </Container>
  
  )
}

export default RegisterForm


