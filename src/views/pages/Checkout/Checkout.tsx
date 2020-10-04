import React, {Component, useEffect, useState} from "react";
import Container from "reactstrap/lib/Container";
import {Form, Formik} from "formik";
import * as Yup from 'yup';
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {TextField} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import {Api} from "../../../api/api";
import {MyFormik} from "../../../ui/MyFormik/MyFormik";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";
import {CartTotals} from "../Cart/CartTotals";
import {CartItemsList} from "../Cart/CartItemsList";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/redux-store";
import {useHistory} from "react-router";
import {ICheckoutPostData} from "../../../interfaces/order";
import {pushNewUserState} from "../../../redux/user-reducer";
import {RoutesCreator} from "../../../utils/RoutesCreator";
import {Link} from "react-router-dom";
import {clearCart, updateCart} from "../../../redux/cart-reducer";

export const Checkout = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signUp, setSignUp] = useState(true);
    const [orderReceivedMessage, setOrderReceivedMessage] = useState<any>(null);


    const cart = useSelector((state: RootState) => state.cart);
    const user = useSelector((state: RootState) => state.user);
    const currency = useSelector((state: RootState) => state.user.selected_currency);

    const CheckoutSchema = Yup.object().shape({
        name:  Yup.string()
            .required('Name is required'),
        email: Yup.string()
            .email('Incorrect email')
            .required('Email is required'),
        recipient_country:  Yup.string()
            .required('Country is required'),
        recipient_state:  Yup.string()
            .required('State is required'),
        recipient_city:  Yup.string()
            .required('City is required'),
        recipient_address:  Yup.string()
            .required('Address is required'),
        // password: Yup.string()
        //     .min(8,'The password must contain at least 8 characters')
        //     .required('Password is required'),
        // password_confirmation: Yup.string()
        //     .required('Password is required')
        //     .oneOf([Yup.ref('password')], 'Passwords mismatch'),
        // pd_agreement: Yup.bool()
        //     .oneOf([true], 'You must agree with the Privacy Policy')
    });

    const handleSubmit = async (values: ICheckoutPostData, {setFieldError, setStatus, resetForm, setSubmitting} : any) => {
        try {
            const response = await Api.createOrder({
                ...values,
                currency: user.selected_currency,
                signup: user.authenticated ? false : signUp,
                products: cart.products.map(item => {
                    return {
                        id: item.id,
                        quantity: item.quantity
                    }
                })
            });

            if (response.hasOwnProperty('token')) {
                dispatch(pushNewUserState({
                    authenticated: true
                }));
            }

            if (response.hasOwnProperty('token') || user.authenticated) {
                setOrderReceivedMessage(
                    <>
                        Thank you for the order! We will contact you soon. You can view your orders in the
                        &nbsp;
                        <Link to={RoutesCreator.ordersHistory()}>
                            orders history
                        </Link>
                    </>
                );

            } else {
                setOrderReceivedMessage(
                    <>
                        Thank you for the order! We will contact you soon.
                    </>
                );
            }

            dispatch(clearCart());
            setIsSubmitting(false);
        } catch (error){
            setIsSubmitting(false);
            throw error;
        }
    };


    useEffect(() => {
        dispatch(updateCart());
    }, [currency]);

    const initialValues: Partial<ICheckoutPostData> = {
            name: user.name,
            email: user.email,
            recipient_country: '',
            recipient_state: '',
            recipient_city: '',
            recipient_address: '',
            payment_method: 'cash_delivery',
            password: '',
            password_confirmation: '',
    };


    return (
        <Container className="small mt-3">
            <h3 className="mb-5">Checkout</h3>
            {
                orderReceivedMessage === null ? (
                    <>
                        <CartItemsList />
                        <div className="mt-5">
                            <MyFormik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                                validationSchema={CheckoutSchema}
                            >
                                {({ values, errors, status, handleChange, touched }: any) => (
                                    <Form>
                                        <Row className="justify-content-between">
                                            <Col lg={8}>
                                                <TextField
                                                    className={"my-0 mb-3"}
                                                    label="Your Name"
                                                    name="name"
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    defaultValue={values['name']}
                                                    {...errors.name && touched.name &&
                                                    {error: true, helperText: errors.name}}
                                                />
                                            </Col>
                                            <Col lg={4}>
                                                <TextField
                                                    className={"my-0 mb-3"}
                                                    label="Email"
                                                    name="email"
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    {...errors.email && touched.email &&
                                                    {error: true, helperText: errors.email}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="justify-content-between">
                                            <Col lg={4}>
                                                <TextField
                                                    className={"my-0 mb-3"}
                                                    label="Country"
                                                    name="recipient_country"
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    {...errors.recipient_country && touched.recipient_country &&
                                                    {error: true, helperText: errors.recipient_country}}
                                                />
                                            </Col>
                                            <Col lg={4}>
                                                <TextField
                                                    className={"my-0 mb-3"}
                                                    label="State"
                                                    name="recipient_state"
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    {...errors.recipient_state && touched.recipient_state &&
                                                    {error: true, helperText: errors.recipient_state}}
                                                />
                                            </Col>
                                            <Col lg={4}>
                                                <TextField
                                                    className={"my-0 mb-3"}
                                                    label="City"
                                                    name="recipient_city"
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    {...errors.recipient_city && touched.recipient_city &&
                                                    {error: true, helperText: errors.recipient_city}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="justify-content-between">
                                            <Col lg={12}>
                                                <TextField
                                                    className="my-0 mb-3"
                                                    label="Street Address"
                                                    name="recipient_address"
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    multiline
                                                    fullWidth
                                                    {...errors.recipient_address && touched.recipient_address &&
                                                    {error: true, helperText: errors.recipient_address}}
                                                />
                                            </Col>
                                        </Row>
                                        {! user.authenticated && (
                                            <>
                                                <Row>
                                                    <Col lg={12}>
                                                        <FormControlLabel
                                                            className="mt-3"
                                                            control={
                                                                <Checkbox
                                                                    name="signup"
                                                                    checked={signUp}
                                                                    value={true}
                                                                    onChange={(e: any) => setSignUp(e.target.checked)}
                                                                />
                                                            }
                                                            label={(
                                                                <>
                                                                    Create an account
                                                                </>
                                                            )}
                                                        />
                                                    </Col>
                                                </Row>
                                                {signUp && (
                                                    <>
                                                        <Row className="justify-content-between">
                                                            <Col lg={12}>
                                                                <TextField
                                                                    className="my-0 mb-3"
                                                                    label="Password"
                                                                    name="password"
                                                                    onChange={handleChange}
                                                                    variant="outlined"
                                                                    type="password"
                                                                    fullWidth
                                                                    {...errors.password && touched.password && {error: true, helperText: errors.password}}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row className="justify-content-between">
                                                            <Col lg={12}>
                                                                <TextField
                                                                    className="my-0 mb-3"
                                                                    label="Password (Again)"
                                                                    name="password_confirmation"
                                                                    onChange={handleChange}
                                                                    variant="outlined"
                                                                    type="password"
                                                                    fullWidth
                                                                    {...errors.password_confirmation && touched.password_confirmation &&
                                                                    {error: true, helperText: errors.password_confirmation}}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={12}>
                                                                <FormControlLabel
                                                                    className="mt-3"
                                                                    control={
                                                                        <Checkbox
                                                                            name="pd_agreement"
                                                                            value={true}
                                                                            onChange={handleChange}
                                                                        />
                                                                    }
                                                                    label={(
                                                                        <>
                                                                            I agree with the <a href="#">Privacy policy</a>
                                                                        </>
                                                                    )}
                                                                />
                                                                {touched.pd_agreement && errors.pd_agreement && (
                                                                    <FormHelperText
                                                                        className="mb-2"
                                                                        {...errors.pd_agreement && {error: true}}
                                                                    >
                                                                        {errors.pd_agreement}
                                                                    </FormHelperText>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </>)}
                                        {status &&  (
                                            <Alert {...status.status === 'error' ? {severity: "error"} : {severity: "success"}}
                                                   className="mb-3">
                                                {status.message}
                                            </Alert>)}
                                        <CartTotals />
                                        <Row className="d-flex">
                                            <Col lg={12}>
                                                <Button color="secondary"
                                                        type='submit'
                                                        variant="contained"
                                                        disabled={isSubmitting}
                                                >
                                                    Order Pizza!
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </MyFormik>
                        </div>
                    </>
                ) : (
                    <Alert severity="success" >
                        {orderReceivedMessage}
                    </Alert>
                )
            }
        </Container>
    );
};