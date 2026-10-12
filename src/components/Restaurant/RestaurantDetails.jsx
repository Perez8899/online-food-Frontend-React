import { Divider, FormControl, 
    FormControlLabel, 
    Grid, 
    Radio, 
    RadioGroup, 
    Typography} from '@mui/material';
import React, { useEffect, useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuCard from './MenuCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getRestaurantById, getRestaurantsCategory } from '../State/Restaurant/Action';
import { getMenuItemsByRestaurantId } from '../State/Menu/Action';


  const foodTypes = [
    {label:"Todo",value:"all"},
  { label: "Vegetariana", value: "vegetarian" },
  { label: "No-Vegetariana", value: "non_vegetarian" },
  {label:"Temporal",value:"seasonal"},
  ];
  const menu=[1,1,1,1,1];

const RestaurantDetails = () => {
    const [foodType, setFootType] = useState("All")
    const [loading, setLoading] = useState(true); //agregado

    const navigate = useNavigate();
    const {auth, restaurant, menu} = useSelector((store) => store);
    const jwt=localStorage.getItem("jwt");
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory]= useState("");

    const {id, city} = useParams();

    const handleFilter=(e)=>{
        setFootType(e.target.value)
        console.log(e.target.value, e.target.name)
    };

      const handleFilterCategory=(e, value)=>{
        setSelectedCategory(value)
        console.log(e.target.value, e.target.name, value);
    };

    console.log("restaurant", restaurant)

    useEffect(()=>{
        dispatch(getRestaurantById({jwt, restaurantId: id}));    //Get the restaurant data
        dispatch(getRestaurantsCategory({jwt, restaurantId: id}));//Get the restaurant categories
       
    }, []); //[jwt, id]) // It is executed when jwt or id changes--If they do not change, the array is empty

    useEffect(()=>{
        dispatch(
            getMenuItemsByRestaurantId({
            jwt, 
            restaurantId:id, 
            vegetarian:foodType==="vegetarian",
            nonveg:foodType==="non_vegetarian",
            seasonal:foodType==="seasonal",
            foodCategory: selectedCategory, //all api.get of menu/Action
        }) 
    );
}, [selectedCategory, foodType]);

    return (
        <div className='px-5 lg:px-20'>
{/*section IMAGE GRID*/}
            <section>
                {/* <h3 className='text-gray-500 py-2 mt-10'>Home/santarita/Zaira Restaurant fast food/3</h3> */}
                <div>
                    <Grid container spacing={2}>
                        <Grid item size={12}>
                            <img
                                className="w-full h-[40vh] object-cover"
                                src="https://images.pexels.com/photos/5786388/pexels-photo-5786388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt=""
                            />
                        </Grid>
                        <Grid item size={6} lg={6}>
                            <img
                                className="w-full h-[40vh] object-cover"
                                src={restaurant.restaurant?.images[0]}
                                alt=""
                            />
                        </Grid>
                        <Grid item size={6} lg={6}>
                            <img
                                className="w-full h-[40vh] object-cover"
                                src={restaurant.restaurant?.images[0]}
                                alt=""
                            />
                        </Grid>

                    </Grid>
                </div>

                <div className='pt-3 pb-5'>
                    <h1 className='text-4xl text-black font-semibold'>{restaurant.restaurant?.name}</h1>
                    <p className='text-black mt-1'>{restaurant.restaurant?.description}</p>

                    <div className="space-y-3 mt-3">
                    <p className='text-black flex items-center gap-3'>
                        <LocationOnIcon />
                        <span>
                          Santa Rita, Rio Cuarto
                        </span>
                    </p>
                    <p className='text-black flex items-center gap-3'>
                        <CalendarMonthIcon />
                        <span>Mon-Sud: 10:00 am - 10:00 pm (Hoy)</span>
                    </p>
                    </div>
                </div>
            </section>
            <Divider/> {/**dividing line comes from MUI */}

 {/*section type, categories and menu*/}
            <section className='pt-[2rem] lg:flex relative '>

{/**Foot Tyoe and Category 20%*/}
                <div className='space-y-10 lg:w-[20%] filter'>
                    <div className='box space-y-5 lg:sticky top-28'>
                        {/**Food Type */}
                        <div className=''>
                            <Typography variant="h5" sx={{ paddingBottom: "1rem", color:"black !important"}}>
                                Tipos de Platillos
                            </Typography>
                            <FormControl className="py-10 space-y-5" component="fieldset">
                                <RadioGroup name="food_type"
                                            value={foodType} 
                                            onChange={handleFilter}>
                                          
                                          {/**function */}
                                          {foodTypes?.map((item)=>  (<FormControlLabel 
                                                                             value={item.value} 
                                                                             control={<Radio />} 
                                                                             label={item.label} 
                                                                             sx={{ color: "#8e1212"}}/>))}
                                </RadioGroup>
                            </FormControl>
                        </div>
<Divider/>
                        {/**categories */}
                        <div className=''>
                            <Typography variant="h5" sx={{ paddingBottom: "1rem", color:"black !important"}}>
                            Comidas por Categoría
                            </Typography>
                            <FormControl className="py-10 space-y-5" component="fieldset">
                                <RadioGroup name="food_category"
                                            value={selectedCategory} 
                                            onChange={handleFilterCategory}>
                                          
                                          {/**function */}
                                          {restaurant.categories.map((item)=>  (<FormControlLabel
                                                                            key={item} 
                                                                             value={item.name} 
                                                                             control={<Radio />} 
                                                                             label={item.name} 
                                                                             sx={{ color: "#8e1212" }}/>))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>

{/**Menu 80%*/}
                <div className='lg:w-[80%] space-y-5 lg:pl-10'>
{/** function menu*  --menu/Reducer*/}
                    {menu?.menuItems.map((item) =><MenuCard item={item}/>)} {/**MenuCard.jsx */}
                </div>
            </section>
        </div>
    )
}

export default RestaurantDetails
