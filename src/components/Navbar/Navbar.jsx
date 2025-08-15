import { Avatar, Badge, Box, IconButton } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { pink } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "./Navbar.css"
import { Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo2.jpg'

const Navbar = () => {

    const {auth, cart} = useSelector(store=>store); //access to the store

    const navigate=useNavigate();

     const navigateToCart = () => {
    navigate("/cart");
  };

    const handleAvatarClick= () => {
        if(auth.user?.role ==="ROLE_CUSTOMER"){
            navigate("/my-profile");
        }else{
            navigate("/admin/restaurants");
        }
    }

    return (
   <Box  className="px-5 sticky top-0 z-50 py-[.8rem] bg-[#21390E]  lg:px-20 flex justify-between">    

 {/* Logo ---------------------------------------------------------------------*/}
            <div className='lg:mr-10 cursor-pointer flex items-center space-x-4'>
                <li onClick={()=>navigate("/")} className="logo font-semibold text-gray-300 text-2xl">
                    <img src={logo} alt="logo" className="h-20 w-auto object-contain"/>
                </li>
            </div>

{/* Icons ----------------------------------------------------------------------*/}
            <div className='flex items-center space-x-2 lg:space-x-10'>
{/*Search button */}
                <div className=''>
                    <IconButton onClick={() => navigate("/search")}>
                        <SearchIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                </div>
{/*Avatar*/}
                <div className=''>
{/*event click to login*/}
                        {auth.user? (  // If there is an authenticated user
                        <Avatar onClick={handleAvatarClick} sx={{ bgcolor: "white", color: pink.A400 }} className="bg-white">
                            {auth.user?.fullName[0].toUpperCase()}</Avatar>   // Display the initial

                            ):(       //if else // If there is NO authenticated user
                                
                    <IconButton onClick={() => navigate("/account/login")}>
                        <Person sx={{ fontSize: "2rem" }}/>
                    </IconButton>)}
                
                </div>

{/**shopping cart */}
                <div className=''>
                    <IconButton onClick={navigateToCart}>
                        <Badge color='primary' badgeContent={cart.cartItems.length}>
                            <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
                        </Badge>
                    </IconButton>
                </div>
            </div>

    </Box> 
    )
}

export default Navbar
