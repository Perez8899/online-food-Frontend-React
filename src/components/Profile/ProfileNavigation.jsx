import React from 'react'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, Drawer, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../State/Authentication/Action';



const menu= [ //MENU is not a function
    {title:"Ordenes", icon:<ShoppingBagIcon  />},
    { title: "Favoritos", icon: <FavoriteIcon /> },
    { title: "Direccion", icon: <HomeIcon /> },
    // { title: "Pago", icon: <AccountBalanceWalletIcon /> },
    { title: "Notificacion", icon: <NotificationsActiveIcon /> },
    { title: "Eventos", icon: <EventIcon /> },
    { title: "Logout", icon: <LogoutIcon /> },
    ];

const ProfileNavigation = ({open, handleClose}) => {
  
{/** detect if it is a small screen*/}
    const isSmallScreen= useMediaQuery("(max-width:1080PX)")
    const navigate =useNavigate();
    const dispatch= useDispatch();

    const handleLogout = () => {
      dispatch(logout());
    };
    const handleNavigate = (item) => {
      navigate(`/my-profile/${item.title.toLowerCase()}`);
      if (item.title === "Logout") {
        handleLogout();
        navigate("/");
      }
    };
{/* is directed by the route, by means of the title, const=MENU*/}      
   
  return (
    <div>  
      <Drawer sx={{ zIndex: 1}}// / Defines the z-index of the Drawer.
              anchor={"left"}   // The Drawer appears from the left.
              open={open}       // Controls whether the drawer is open or closed.
              onClose={handleClose}// Executes handleClose when the user closes the Drawer.
              variant={isSmallScreen ? "temporary" : "permanent"} >   {/*Change the Drawer type according to the screen size.*/}
               
            <div className="w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center
             text-xl space-y-8 pt-16 gap-3">

                {menu.map((item, i)=><>
                <div onClick={() => handleNavigate(item)}
                     className="px-5 flex items-center space-x-5 cursor-pointer
            hover:bg-[#7de51c] hover:bg-opacity-50  transition-colors duration-300">
                    {item.icon}
                    <span>{item.title}</span>
                </div>

        {/* The divider will appear on the second item. 
         Do not show the divider line in the last item. */}
                {i !== menu.length - 1 && <Divider />}

                </>)}
            </div>
      </Drawer>
    </div>
  )
}

export default ProfileNavigation
