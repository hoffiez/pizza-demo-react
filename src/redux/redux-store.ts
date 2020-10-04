import {applyMiddleware, combineReducers, createStore} from "redux";
import cartReducer from "./cart-reducer";
import thunkMiddleware from "redux-thunk";
import userReducer from "./user-reducer";
import settingsReducer from "./settings-reducer";

const reducers = combineReducers({
    cart: cartReducer,
    user: userReducer,
    settings: settingsReducer
});

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

export type RootState = ReturnType<typeof reducers>;

export default store;