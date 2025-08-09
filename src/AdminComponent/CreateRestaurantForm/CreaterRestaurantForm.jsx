import { Button, CircularProgress, Grid, IconButton, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from "@mui/icons-material/Close";
import { createRestaurant } from "../../components/State/Restaurant/Action"
import { uploadToCloudinary } from '../util/UploadToCloudinary';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('El nombre del restaurante es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),

  description: Yup.string()
    .trim()
    .required('La descripción es obligatoria')
    .min(20, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder los 500 caracteres'),

  cuisineType: Yup.string()
    .trim()
    .required('Selecciona un tipo de cocina'),

  streetAddress: Yup.string()
    .trim()
    .required('La dirección es obligatoria')
    .min(5, 'La dirección debe tener al menos 5 caracteres'),

  city: Yup.string()
    .trim()
    .required('La ciudad es obligatoria'),

  stateProvince: Yup.string()
    .trim()
    .required('El estado/provincia es obligatorio'),

  postalCode: Yup.string()
    .trim()
    .required('El código postal es obligatorio')
    .matches(/^[0-9]+$/, 'El código postal solo debe contener números'),

  country: Yup.string()
    .trim()
    .required('El país es obligatorio'),

  openingHours: Yup.string()
    .trim()
    .required('Los horarios de apertura son obligatorios')
    .matches(
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(-(Mon|Tue|Wed|Thu|Fri|Sat|Sun))?: \d{1,2}:\d{2} (AM|PM) - \d{1,2}:\d{2} (AM|PM)$/,
      'Formato de horario inválido. Ejemplo: "Mon-Sun: 10:00 AM - 10:00 PM"'
    ),

  email: Yup.string()
    .trim()
    .email('Ingresa un email válido')
    .required('El email es obligatorio'),

  mobile: Yup.string()
    .trim()
    .required('El teléfono móvil es obligatorio')
    .matches(/^[0-9]+$/, 'El teléfono solo debe contener números')
    .min(8, 'El teléfono debe tener al menos 8 dígitos'),

  twitter: Yup.string()
  .trim()
  .test('twitter', 'URL de Twitter inválida', (value) => 
    !value || // Si está vacío, pasa la validación
    /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}$/.test(value)
  )
  .nullable(),

instagram: Yup.string()
  .trim()
  .test('instagram', 'URL de Instagram inválida', (value) => 
    !value || // Si está vacío, pasa la validación
    /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_]{1,30}$/.test(value)
  )
  .nullable(),
  images: Yup.array()
    .min(1, 'Debes subir al menos una imagen del restaurante')
    .max(4, 'No puedes subir más de 4 imágenes')
});

const initialValues = {
  name: "",
  description: "",
  cuisineType: "",
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  email: "",
  mobile: "",
  twitter: null,
  instagram: null,
  openingHours: "Mon-Sun: 10:00 AM - 10:00 PM",
  images: [],
};

const CreaterRestaurantForm = () => {
  const [uploadImage, setUploadImage] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("jwt")

  const handleSubmit = (values) => {
    const data = {
      name: values.name,
      description: values.description,
      cuisineType: values.cuisineType,
      address: {
        streetAddress: values.streetAddress,
        city: values.city,
        stateProvince: values.stateProvince,
        postalCode: values.postalCode,
        country: values.country,
      },
      contactInformation: {
        email: values.email,
        mobile: values.mobile,
        twitter: values.twitter,
        instagram: values.instagram,
      },
      openingHours: values.openingHours,
      images: values.images,
    };
    dispatch(createRestaurant({ data, token }));
    console.log("data", data);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadImage(true)
    const image = await uploadToCloudinary(file)
    console.log("imagen", image);

    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="py-10 px-5 lg:flex items-center justify-center min-h-screen">
      <div className="lg:max-w-4xl ">

        <h1 className="font-bold text-2xl text-center py-2">
          No Tienes Restaurante Registrado! Agregar Tu Restaurante
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            {/* --------------------------------------------------------------*/}
            <Grid className="flex flex-wrap gap-5" item size={12}>
              {/* add restaurant image */}
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
                onBlur={formik.handleBlur}
              />
              {/* UPLOAD IMAGES */}
              <label className="relative inline-block" htmlFor="fileInput">
                <div className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600">
                  <AddAPhotoIcon className="text-white" />
                  {uploadImage && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <CircularProgress className="text-blue-500" />
                    </div>
                  )}
                </div>
              </label>

              {/* image */}
              <div className="flex flex-wrap gap-2">
                {formik.values.images.map((image, index) =>
                  <div className='relative'>
                    <img
                      className="w-24 h-24 object-cover"
                      key={index}
                      src={image}
                      alt={`ImagenProducto ${index + 1}`} />
                    {/* delete images X */}
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        outline: "none",
                      }}>
                      <CloseIcon sx={{ fontSize: "1rem", color: "red" }} />
                    </IconButton>
                  </div>)}
              </div>
              {formik.touched.images && formik.errors.images && (
                <div className="text-red-300 text-sm">{formik.errors.images}</div>
              )}

            </Grid>
            {/* --------------------------------------------------------------*/}
            <Grid item size={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nombre"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={<span className="text-red-300">
                  {formik.touched.name && formik.errors.name}
                </span>}
              />
            </Grid>

            <Grid item size={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Descripcion"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={<span className="text-red-300">
                  {formik.touched.description && formik.errors.description}
                </span>}
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                id="cuisineType"
                name="cuisineType"
                label="Tipo Comida"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cuisineType}
                error={formik.touched.cuisineType && Boolean(formik.errors.cuisineType)}
                helperText={<span className="text-red-300">
                  {formik.touched.cuisineType && formik.errors.cuisineType}
                </span>}
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                id="openingHours"
                name="openingHours"
                label="Hora Apertura"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.openingHours}
                error={formik.touched.openingHours && Boolean(formik.errors.openingHours)}
                helperText={<span className="text-red-300">
                  {formik.touched.openingHours && formik.errors.openingHours}
                </span>}
              />
            </Grid>
            <Grid item size={12}>
              <TextField
                fullWidth
                id="streetAddress"
                name="streetAddress"
                label="Direccion"
                variant="outlined"
                onChange={formik.handleChange}

                onBlur={formik.handleBlur}
                value={formik.values.streetAddress}
                error={formik.touched.streetAddress && Boolean(formik.errors.streetAddress)}
                helperText={<span className="text-red-300">
                  {formik.touched.streetAddress && formik.errors.streetAddress}
                </span>}
              />
            </Grid>
            <Grid item size={4}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="Ciudad"
                variant="outlined"
                onChange={formik.handleChange}

                onBlur={formik.handleBlur}
                value={formik.values.city}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={<span className="text-red-300">
                  {formik.touched.city && formik.errors.city}
                </span>}
              />
            </Grid>
            <Grid item size={4}>
              <TextField
                fullWidth
                id="stateProvince"
                name="stateProvince"
                label="Estado/Provincia"
                variant="outlined"
                onChange={formik.handleChange}

                onBlur={formik.handleBlur}
                value={formik.values.stateProvince}
                error={formik.touched.stateProvince && Boolean(formik.errors.stateProvince)}
                helperText={<span className="text-red-300">
                  {formik.touched.stateProvince && formik.errors.stateProvince}
                </span>}
              />
            </Grid>
            <Grid item size={4}>
              <TextField
                fullWidth
                id="postalCode"
                name="postalCode"
                label="Codigo Postal"
                variant="outlined"
                onChange={formik.handleChange}

                onBlur={formik.handleBlur}
                value={formik.values.postalCode}
                error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                helperText={<span className="text-red-300">
                  {formik.touched.postalCode && formik.errors.postalCode}
                </span>}
              />
            </Grid>
            <Grid item size={12}>
              <TextField
                fullWidth
                id="country"
                name="country"
                label="Pais"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.country}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={<span className="text-red-300">
                  {formik.touched.country && formik.errors.country}
                </span>}
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={<span className="text-red-300">
                  {formik.touched.email && formik.errors.email}
                </span>}
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                id="mobile"
                name="mobile"
                label="Telefono"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={<span className="text-red-300">
                  {formik.touched.mobile && formik.errors.mobile}
                </span>}
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                id="twitter"
                name="twitter"
                label="Twitter (opcional)"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.twitter}
                error={formik.touched.twitter && Boolean(formik.errors.twitter)}
                helperText={<span className="text-red-300">
                  {formik.touched.twitter && formik.errors.twitter}
                </span>}
              />
            </Grid>
            <Grid item size={6}>
              <TextField
                fullWidth
                id="instagram"
                name="instagram"
                label="Instagram (opcional)"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.instagram}
                error={formik.touched.instagram && Boolean(formik.errors.instagram)}
                helperText={<span className="text-red-300">
                  {formik.touched.instagram && formik.errors.instagram}
                </span>}
              />
            </Grid>
            {/* ---------------------------------------------------------------------*/}
            <Grid item size={8}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                size="large"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {formik.isSubmitting ? <CircularProgress size={24} /> : 'Crear Restaurante'}
              </Button>
            </Grid>

          </Grid>


        </form>

      </div>
    </div> //final div
  );
};

export default CreaterRestaurantForm
