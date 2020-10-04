import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {Header} from "./views/partials/Header/Header";
import {Route} from "react-router";
import {RoutesCreator} from "./utils/RoutesCreator";
import {Catalog} from "./views/pages/Catalog/Catalog";
import {useDispatch, useSelector} from "react-redux";
import {pushCartStateFromStorage} from "./redux/cart-reducer";
import {CartPage} from "./views/pages/Cart/CartPage";
import {SignIn} from "./views/pages/SignIn/SignIn";
import {SignUpPage} from "./views/pages/SignUp/SignUpPage";
import {Checkout} from "./views/pages/Checkout/Checkout";
import {Footer} from "./views/partials/Footer/Footer";
import {authenticateUser, CurrencyType, pushNewUserState} from "./redux/user-reducer";
import axios from "axios";
import {RootState} from "./redux/redux-store";
import {OrdersHistory} from "./views/pages/OrdersHistory/OrdersHistory";

declare global {
    interface Window {
        axios: any;
    }
}

window.axios = axios;
window.axios.defaults.baseURL = "http://pizza.local/api/";

function App() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const setCurrency = () => {
        const currency: any = window.localStorage.getItem('currency');
        const selectedCurrency: CurrencyType = currency !== null ? currency : 'USD';
        dispatch(pushNewUserState({
            selected_currency: selectedCurrency
        }));
    };

    useEffect(() => {
        dispatch(authenticateUser());
        dispatch(pushCartStateFromStorage());
        setCurrency();
    }, []);

    // useEffect(() => {
    //     if (user.selected_currency === null) return;
    //     window.location.reload();
    // }, [user.selected_currency]);

    return (
        <div className="App">
            <Header/>
            <Route exact
                   path={RoutesCreator.home()}
                    render={() => <Catalog />}
            />
            <Route exact
                   path={RoutesCreator.cart()}
                    render={() => <CartPage />}
            />
            <Route exact
                   path={RoutesCreator.signIn()}
                   render={() => <SignIn />}
            />
            <Route exact
                   path={RoutesCreator.signUp()}
                   render={() => <SignUpPage />}
            />
            <Route exact
                   path={RoutesCreator.checkout()}
                   render={() => <Checkout />}
            />
            <Route exact
                   path={RoutesCreator.ordersHistory()}
                   render={() => <OrdersHistory />}
            />
            <Footer/>
        </div>
     );
}

export default App;
