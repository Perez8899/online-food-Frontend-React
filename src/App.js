import { CssBaseline, ThemeProvider, Snackbar, Alert } from '@mui/material';
import './App.css';

import darkTheme from './Theme/DarkTheme';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUser } from './components/State/Authentication/Action';
import { findCart } from './components/State/Cart/Action';
import Routers from './Routers/Routers';
import { getRestaurantByUserId } from './components/State/Restaurant/Action';
import { CLEAR_AUTH_MESSAGES } from './components/State/Authentication/ActionType';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
const [loading, setLoading] = useState(true);

  const { auth } = useSelector(store => store);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Show Snackbar when success or error changes
  useEffect(() => {
    if (auth.success) {
      setSnackbarMessage(auth.success);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (auth.error) {
      setSnackbarMessage(auth.error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [auth.success, auth.error]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    dispatch({ type: CLEAR_AUTH_MESSAGES });
  };
  // User and cart fetch
  useEffect(() => {
  const loadUser = async () => {
    if (auth.jwt || jwt) {
      await dispatch(getUser(auth.jwt || jwt));
      await dispatch(findCart(auth.jwt || jwt));
    }
    setLoading(false);
  };
  loadUser();
}, [auth.jwt]);


  // Load restaurants if user is owner
  useEffect(() => {
    if (auth.user?.role === "ROLE_RESTAURANT_OWNER") {
      dispatch(getRestaurantByUserId(auth.jwt || jwt));
    }
  }, [auth.user]);
if (loading) return <div>Cargando...</div>;
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* my ROUTERS*/}
      <Routers />

      {/*  Snackbar global */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Toastify container */}
      <ToastContainer position="top-center" autoClose={3000} />

    </ThemeProvider>
  );
}

export default App;
