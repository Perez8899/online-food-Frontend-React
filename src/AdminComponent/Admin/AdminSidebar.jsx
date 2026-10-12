import React from 'react'
import { Dashboard } from '@mui/icons-material';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShopTwoIcon from "@mui/icons-material/ShopTwo";
import CategoryIcon from '@mui/icons-material/Category';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EventIcon from "@mui/icons-material/Event";
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, Drawer, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../components/State/Authentication/Action';

const menu = [
  { title: "Dashboard", icon: <Dashboard />, path: "/" },
  { title: "Ordenes", icon: <ShoppingBagIcon />, path: "/orders" },
  { title: "Categoria", icon: <CategoryIcon />, path: "/category" },
  { title: "Ingredientes", icon: <FastfoodIcon />, path: "/ingredients" },
  { title: "Menu", icon: <ShopTwoIcon />, path: "/menu" },
  { title: "Promociones", icon: <EventIcon />, path: "/event" },
  { title: "Detalles", icon: <AdminPanelSettingsIcon />, path: "/details" },
  { title: "Reporte-Ventas", icon: <PlagiarismIcon />, path: "/reports" },
  { title: "Logout", icon: <LogoutIcon />, path: "/" },

];

const AdminSidebar = ({ handleClose, open }) => {
  const isSmallScreen = useMediaQuery("(max-width:1080px)"); //responsive screen
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { restaurant } = useSelector(store => store);

  const handleNavigate = (item) => {
    navigate(`/admin/restaurants${item.path}`);
    if (item.title === "Logout") {
      navigate("/");
      dispatch(logout());
    } else if (item.title === "Restaurants") {
      navigate("/admin");
    }
    handleClose()
  };



  return (
    <div>
      <Drawer
        sx={{
          zIndex: 1,
          "& .MuiDrawer-paper": {
            backgroundColor: "#1A1A1A",
            color: "white",
          }
        }}
        anchor={"left"}
        open={true}
        onClose={handleClose}
        variant={isSmallScreen ? "temporary" : "permanent"}
      >
        <div className="w-[70vw] lg:w-[20vw] group h-[100vh] flex flex-col justify-center mt-10
            text-xl space-y-[1.65rem]">

          {menu.map((item, i) => <>
            <div onClick={() => handleNavigate(item)} key={i} className="px-5 flex items-center space-x-5 cursor-pointer
            hover:bg-[#7de51c] hover:bg-opacity-50  transition-colors duration-300">
              {item.icon}

              <span >{item.title} </span>

            </div>
            {i !== menu.length - 1 && <Divider />}

            <div />
          </>)}

        </div>
      </Drawer>
    </div>
  )
}

export default AdminSidebar