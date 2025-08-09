
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useSelector((state) => state);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    // Mientras auth.user no esté definido (ni null ni objeto), no hacer nada
    if (typeof auth.user === 'undefined') return;

    const wasLoggedOut = localStorage.getItem("loggedOut");

    // Esperar a que el usuario sea cargado, y solo mostrar error si NO hay jwt
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
      // Si tiene jwt pero aún no ha llegado el user, no mostramos el error
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
