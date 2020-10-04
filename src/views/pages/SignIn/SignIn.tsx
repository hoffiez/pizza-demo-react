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
import {useDispatch} from "react-redux";
import {signIn} from "../../../redux/user-reducer";
import {ISignInCredentials} from "../../../interfaces/user";
import {useHistory} from "react-router";
import {RoutesCreator} from "../../../utils/RoutesCreator";


export const SignIn = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const SignInSchema = Yup.object().shape({
        email: Yup.string()
            .email('Incorrect email')
            .required('The field is required'),
        password: Yup.string()
            .min(8,'The password must contain at least 8 characters')
            .required('The field is required'),
    });

    const handleSubmit = async (credentials: ISignInCredentials, { setStatus }: any) => {
        try {
            setIsSubmitting(true);
            await dispatch(signIn(credentials));

            setStatus({
                status: 'success',
                message: "You've successfully signed in. You will be redirected in 3 seconds..."
            });
            setTimeout(function() {
                history.push(RoutesCreator.home());
            }, 3000);

            setIsSubmitting(false);
        } catch (error){
            setIsSubmitting(false);
            throw error;
        }
    };

    return (
        <Container className="mt-3">
            <h3>Sign In</h3>
            <div style={{width: '400px', margin: 'auto'}}>
                <MyFormik
                    initialValues={{
                        password: '',
                        email: '',
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={SignInSchema}
                >
                    {({ errors, status, handleChange, touched }: any) => (
                        <Form>
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
                            {status &&  (
                                <Alert {...status.status === 'error' ? {severity: "error"} : {severity: "success"}}
                                       className="mb-3">
                                    {status.message}
                                </Alert>)}

                            <Row className="d-flex align-items-center">
                                <Col lg={12}>
                                    <Button color="secondary"
                                            type='submit'
                                            variant="contained"
                                            disabled={isSubmitting}
                                    >
                                        Sign In
                                    </Button>
                                    <a href="#" className="underline ml-2">Forgot password?</a>
                                </Col>
                            </Row>
                        </Form>


                    )}
                </MyFormik>
            </div>
        </Container>
    )
};