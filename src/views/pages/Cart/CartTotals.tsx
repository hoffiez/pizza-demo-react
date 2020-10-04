import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux-store";
import {Lang} from "../../../utils/Lang";

export const CartTotals = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const currency = useSelector((state: RootState) => state.settings.currency);

    const currencySymbol = Lang.currency[currency];

    return (
        <div className="d-flex align-items-end flex-column totals">
            <div>Subtotal: {cart.subtotal} {currencySymbol}</div>
            <div>VAT: {cart.tax} {currencySymbol}</div>
            <div>Delivery: {cart.delivery_price} {currencySymbol}</div>
            <div>Total: <b>{cart.sum_total} {currencySymbol}</b></div>
        </div>
    )
};