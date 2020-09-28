import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux-store";
import {Lang} from "../../../utils/Lang";

export const CartTotals = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const user = useSelector((state: RootState) => state.user);

    const currencySymbol = Lang.currency[user.selected_currency || 'USD'];

    return (
        <div className="d-flex align-items-end flex-column totals">
            <div>Subtotal: {cart.subtotal} {currencySymbol}</div>
            <div>VAT: {cart.tax_value} {currencySymbol}</div>
            <div>Delivery: {cart.delivery_price} {currencySymbol}</div>
            <div>Total: <b>{cart.sum_total} {currencySymbol}</b></div>
        </div>
    )
};