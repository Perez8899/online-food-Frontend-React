
import { useLocation, useNavigate } from 'react-router-dom'
import {Box, Modal} from '@mui/material';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    outline: "none",
    p: 4,
  };

const Auth = () => {
    const location=useLocation();
    const navigate=useNavigate();
    const handleClose =()=> {
       navigate("/")
    };
    
  return (
   <>
       <Modal 
/**closes the user registration window */      
         onClose={handleClose}
         open={
           location.pathname === "/account/register" ||
           location.pathname === "/account/login" 
       }>
        
           <Box sx={style}>
{/*conditional// REGISTER OR LOGIN*/}
              {location.pathname==="/account/register"?<RegisterForm/>:<LoginForm/>}
           </Box>
   
       </Modal>
         
       </>
  )
}

export default Auth
