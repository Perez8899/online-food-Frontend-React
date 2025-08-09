import axios from "axios";
import { ADD_TO_FAVORITES_FAILURE, 
    ADD_TO_FAVORITES_REQUEST, 
    ADD_TO_FAVORITES_SUCCESS, 
    GET_USER_FAILURE, 
    GET_USER_REQUEST, 
    GET_USER_SUCCESS, 
    LOGIN_FAILURE, 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGOUT, 
    REGISTER_FAILURE, 
    REGISTER_REQUEST, 
    REGISTER_SUCCESS,
   } from "./ActionType";
import { api, API_URL } from "../../Config/Api";

//method register--------------------------------------------------------------------------------
export const registerUser = (reqData) => async (dispatch) => {
    console.log("resgister request data ",reqData.userData)
    try {
      dispatch({ type: REGISTER_REQUEST });
  
      const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData);
//if there is data we have the JWT and store it in the localStorage
      if(data.jwt) localStorage.setItem("jwt",data.jwt)         
      if(data.role==="ROLE_RESTAURANT_OWNER"){
        reqData.navigate("/admin/restaurants")
      }
      else{
        reqData.navigate("/")
      }

      dispatch({ type: REGISTER_SUCCESS, payload: data });
      console.log("Registro Exitoso ", data);



    }catch(error){
        dispatch({
            type: REGISTER_FAILURE,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          });
        console.log("error", error)
    }
}

//method login--------------------------------------------------------------------------
export const loginUser = (reqData) => async (dispatch) => {
    console.log("resgister request data ",reqData.userData)
    try {
      dispatch({ type: LOGIN_REQUEST});
  
      const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData);
//if there is data we have the JWT and store it in the localStorage
      if(data.jwt) localStorage.setItem("jwt",data.jwt)         
      if(data.role==="ROLE_RESTAURANT_OWNER"){
        reqData.navigate("/admin/restaurants")
      }
      else{
        reqData.navigate("/")
      }

      dispatch({ type: LOGIN_SUCCESS, payload: data });
      console.log("Login Exitoso ", data);



    }catch(error){
        dispatch({
            type: LOGIN_FAILURE,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          });
        console.log("error", error)
    }
}

// method Get--------------------------------------------------------------------------
export const getUser = (token) => {
    return async (dispatch) => {
      dispatch({ type: GET_USER_REQUEST });
      try {
        const response = await api.get(`/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        
        dispatch({ type: GET_USER_SUCCESS, payload: user });
        console.log("req User ", user);
      } catch (error) {
        const errorMessage = error.message;
        dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
      }
    };
  };

// method put Add Favorites-------------------------------------------------------------
  export const addToFavorites = ({restaurantId,jwt}) => {
    return async (dispatch) => {
      dispatch({ type: ADD_TO_FAVORITES_REQUEST });
      try {
        const { data } = await api.put(`api/restaurants/${restaurantId}/add-favorites`,{},{
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log("Agregado a favoritos ",data)
        dispatch({ type: ADD_TO_FAVORITES_SUCCESS, payload: data });

      } catch (error) {
        console.log("catch error ",error)
        dispatch({
          type: ADD_TO_FAVORITES_FAILURE,
          payload: error.message,
        });
      }
    };
  };

//Method Logout
 // actions/authActions.js (o donde esté tu logout)
export const logout = () => {
  return async (dispatch) => {
    // ✅ Bandera para evitar toast de "no has iniciado sesión"
    localStorage.setItem("loggedOut", "true");

    // ✅ Remover token u otros datos
    localStorage.removeItem("jwt");

    // ✅ Limpiar Redux state
    dispatch({ type: LOGOUT });

    // ✅ Puedes limpiar otros slices si los tienes (carrito, perfil, etc.)
  };
};


 