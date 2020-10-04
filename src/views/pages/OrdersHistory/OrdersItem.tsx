import React from "react";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {IOrder} from "../../../interfaces/order";
import {Lang} from "../../../utils/Lang";

interface IOrdersItem {
    order: IOrder
}

export const OrdersItem = ({order}: IOrdersItem) => {

    const currencySymbol = Lang.currency[order.currency];

    return (
        <div className={"mb-3 border-bottom"}>
            <h5>Order №{order.id}</h5>
            {order.products.map((item) => (
                <Row>
                    <Col lg={7}>{item.title}</Col>
                    <Col lg={3}>{item.pivot.quantity} x {item.pivot.buy_price} {currencySymbol}</Col>
                    <Col lg={2}>{item.pivot.subtotal} {currencySymbol}</Col>
                </Row>
            ))}
            <div className="d-flex align-items-start flex-column mt-3 totals">
                <div>Subtotal: {order.subtotal} {currencySymbol}</div>
                <div>VAT: {order.tax} {currencySymbol}</div>
                <div>Delivery: {order.delivery_price} {currencySymbol}</div>
                <div>Total: <b>{order.sum_total} {currencySymbol}</b></div>
            </div>
        </div>
    )
};