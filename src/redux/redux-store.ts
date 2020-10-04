import {applyMiddleware, combineReducers, createStore} from "redux";
import cartReducer from "./cart-reducer";
import thunkMiddleware from "redux-thunk";
import userReducer from "./user-reducer";

const reducers = combineReducers({
    cart: cartReducer,
    user: userReducer
});

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

export type RootState = ReturnType<typeof reducers>;

export default store;