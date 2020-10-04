import React, {useState} from "react";
import Container from "reactstrap/lib/Container";
import {Form} from "formik";
import * as Yup from 'yup';
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {TextField} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import {MyFormik} from "../../../ui/MyFormik/MyFormik";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";
import {ISignUpCredentials} from "../../../interfaces/user";
import {useDispatch} from "react-redux";
import {signUp} from "../../../redux/user-reducer";
import {RoutesCreator} from "../../../utils/RoutesCreator";
import {useHistory} from "react-router";


export const SignUpPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const SignUpSchema = Yup.object().shape({
        name:  Yup.string()
            .required(),
        email: Yup.string()
            .email('Incorrect email')
            .required(),
        password: Yup.string()
            .min(8,'The password must contain at least 8 characters')
            .required(),
        password_confirmation: Yup.string()
            .required()
            .oneOf([Yup.ref('password')], 'Passwords mismatch'),
        pd_agreement: Yup.bool()
            .oneOf([true], 'You must agree with the Privacy Policy')
    });

    const initialValues: ISignUpCredentials = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        pd_agreement: false
    };

    const handleSubmit = async (values: ISignUpCredentials, {setStatus} : any) => {
        try {
            setIsSubmitting(true);
            await dispatch(signUp(values));
            setStatus({
                status: 'success',
                message: "You registered successfully. You will be redirected in 3 seconds..."
            });
            setTimeout(function() {
                window.location = RoutesCreator.home();
            }, 3000);
            setIsSubmitting(false);
        } catch (error){
            setIsSubmitting(false);
            throw error;
        }
    };

    return (
        <Container className="mt-3">
            <h3>Sign Up</h3>
            <div style={{width: '400px', margin: 'auto'}}>
                <MyFormik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={SignUpSchema}
                >
                    {({ errors, status, handleChange, touched }: any) => (
                        <Form>
                            <Row className="justify-content-between">
                                <Col lg={12}>
                                    <TextField
                                        className={"my-0 mb-3"}
                                        label="Your Name"
                                        name="name"
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                        {...errors.name && touched.name && {error: true, helperText: errors.name}}
                                    />
                                </Col>
                            </Row>
                            <Row className="justify-content-between">
                                <Col lg={12}>
                                    <TextField
                                        className={"my-0 mb-3"}
                                        label="Email"
                                        name="email"
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                        {...errors.email && touched.email && {error: true, helperText: errors.email}}
                                    />
                                </Col>
                            </Row>
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
                            {status &&  (
                                <Alert {...status.status === 'error' ? {severity: "error"} : {severity: "success"}}
                                       className="mb-3">
                                    {status.message}
                                </Alert>)}

                            <Row className="d-flex">
                                <Col lg={12}>
                                    <Button color="secondary"
                                            type='submit'
                                            variant="contained"
                                            disabled={isSubmitting}
                                    >
                                        Sign Up
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </MyFormik>
            </div>
        </Container>
    )
};