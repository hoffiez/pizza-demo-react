import React, {useEffect, useState} from "react";
import {Api} from "../../../api/api";
import Container from "reactstrap/lib/Container";
import {IOrder} from "../../../interfaces/order";
import {CircularProgress} from "@material-ui/core";
import {OrdersItem} from "./OrdersItem";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux-store";


export const OrdersHistory = () => {
    const user = useSelector((state: RootState) => state.user);

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<IOrder[]>([]);


    useEffect(() => {
        if (!user.authenticated) return;

        (async() => {
            const response = await Api.getOrders();
            console.log(response);
            setOrders(response);
            setLoading(false);
        })();

    }, [user.authenticated]);

    return (
        <Container className="small mt-3">
            <h3 className="mb-3">My Orders</h3>
            {loading ? (
                <CircularProgress color="secondary" style={{margin: 'auto'}}/>
            ) : orders.length === 0 ? (
                <h5>You don't have orders yet</h5>
            ) : orders.map((order) => (
                    <OrdersItem order={order} key={order.id} />
                ))
            }
        </Container>
    )
};