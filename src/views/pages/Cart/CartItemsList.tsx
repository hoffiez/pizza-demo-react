import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux-store";
import {CartItem} from "./CartItem";


export const CartItemsList = () => {
    const cart = useSelector((state: RootState) => state.cart);

    return (
        <>
            {cart.products.map((item) => (
                <CartItem item={item} key={item.id} />
            ))}
        </>
    )
};