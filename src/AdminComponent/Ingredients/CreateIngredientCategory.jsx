import React, { useState } from "react";
import { TextField, Button, makeStyles, Card, Modal, Box } from "@mui/material";
import { Create } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createIngredientCategory } from "../../components/State/Ingredients/Action";

const CreateIngredientCategoryForm = ({ handleClose }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { auth, restaurant } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  const [formData, setFormData] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "El Campo Categoria es requerido";
      valid = false;
    } else {
      newErrors.name = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log("Form submitted:", formData);
    const data = {
      name: formData.name,
      restaurantId: restaurant.usersRestaurant.id,
    };
    
    dispatch(createIngredientCategory({ data, jwt: auth.jwt || jwt }));
    setFormData({ name: "" });
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  return (
    <div className=" ">
      <div className="p-5">
        <h1 className="text-white text-center text-xl pb-10">
          Crear Categoria
        </h1>
        <form className="space-y-5" onSubmit={handleFormSubmit}>
          <TextField
            label="Nombre Categoria de Ingrediente"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
            sx={{
              '& .MuiFormHelperText-root.Mui-error': {
                color: '#fee2e2' 
              }
            }}
          />

          <Button type="submit" variant="contained" color="primary">
            Crear
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateIngredientCategoryForm;