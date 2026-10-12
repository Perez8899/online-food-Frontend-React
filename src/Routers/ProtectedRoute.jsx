
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useSelector((state) => state);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
// As long as auth.user is not defined (neither null nor object), do nothing
    if (typeof auth.user === 'undefined') return;

    const wasLoggedOut = localStorage.getItem("loggedOut");

    // Wait for the user to be loaded, and only show error if there is NO jwt
    if (!auth.user) {
      const hasJwt = auth.jwt || localStorage.getItem("jwt");

      if (!hasJwt) {
        if (!wasLoggedOut) {
          toast.error("Debes iniciar sesión para acceder a esta página.");
        } else {
          localStorage.removeItem("loggedOut");
        }

        setRedirectPath("/account/login");
      }
      // If you have jwt but the user hasn't arrived yet, we don't show the error
    } else if (requiredRole && auth.user.role !== requiredRole) {
      toast.error("No tienes permisos para acceder a esta página.");
      setRedirectPath("/");
    }
  }, [auth.user, auth.jwt, requiredRole]);


  if (typeof auth.user === 'undefined' || (!auth.user && !redirectPath)) {
    return null;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
