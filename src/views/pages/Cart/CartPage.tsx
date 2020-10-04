import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux-store";
import Container from "reactstrap/lib/Container";
import Col from "reactstrap/lib/Col";
import Button from "@material-ui/core/Button";
import Row from "reactstrap/lib/Row";
import {useHistory} from "react-router";
import {RoutesCreator} from "../../../utils/RoutesCreator";
import {CartTotals} from "./CartTotals";
import {CartItemsList} from "./CartItemsList";

export const CartPage = () => {
    const history = useHistory();
    const cart = useSelector((state: RootState) => state.cart);

    return (
        <Container className="small">
            <h3 className="mb-3">Cart</h3>
            {cart.products.length === 0 ? (
                <h4 style={{textAlign: 'center'}}>Cart is empty</h4>
            ) : (
                <>
                    <CartItemsList/>
                    <CartTotals />
                    <Row>
                        <Col lg={12} className="d-flex mt-3 justify-content-center">
                            <Button color="secondary"
                                    type='submit'
                                    variant="outlined"
                                    size="large"
                                    className="mx-1"
                                    onClick={() => history.push(RoutesCreator.home())}
                            >
                                Back to menu
                            </Button>

                            <Button color="secondary"
                                    type='submit'
                                    variant="contained"
                                    size="large"
                                    className="mx-1"
                                    onClick={() => history.push(RoutesCreator.checkout())}
                            >
                                Checkout
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    )
};