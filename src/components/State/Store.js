import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import {authReducer} from "./Authentication/Reducer" //specific reducer that handles the authentication part of the global status
import { thunk } from "redux-thunk";
import restaurantReducer from "./Restaurant/Reducer";
import menuItemReducer from "./Menu/Reducer";
import cartReducer from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";
import restaurantsOrderReducer from "./RestaurantOrder/restaurants.order.reducer";
import { ingredientReducer } from "./Ingredients/Reducer";


//(root reducer)

const rooteReducer = combineReducers ({ 
    //the reducers are combined into a single object.combineReducers({ auth: authReducer....and the other individual reducers }):
    
    auth:authReducer, /* data handled by authReducer */ 
    restaurant:restaurantReducer, /* data handled by restauranReducer */ 
    menu:menuItemReducer,
    cart:cartReducer,
    order:orderReducer,

    //ADMIN
    restaurantsOrder:restaurantsOrderReducer,
    ingredients:ingredientReducer,

    


})

export const store=legacy_createStore(rooteReducer, applyMiddleware(thunk)) //create the store with the combined reducers and the middleware applied