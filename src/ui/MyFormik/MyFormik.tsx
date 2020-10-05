import React, {useEffect, useState} from "react";
import {Formik} from "formik";

interface IMyFormik {
    onSubmit: (values: any, {setFieldError, setStatus, resetForm, setSubmitting} : any) => any,
    validationSchema: any,
    initialValues: any,
    children: any
}

export const MyFormik = ({
    onSubmit,
    validationSchema,
    initialValues,
    children
 }: IMyFormik) => {

    const handleSubmit = async (values: any, {setFieldError, setStatus, resetForm, setSubmitting} : any) => {
        try {
            const response = await onSubmit(values, {setFieldError, setStatus, resetForm, setSubmitting});
          //  resetForm();
            if (response?.message) {
                setStatus({status: 'success', message: response.message});
            }
            setSubmitting(false);
        } catch (error){
            if (error.response?.data?.message) {
                setStatus({status: 'error', message: error.response.data.message});
            }

            error.response.data.errors &&
            Object.entries(error.response.data.errors).map((entry:any) => {
                let key: string = entry[0];
                let errors: Array<string> = entry[1];
                let helperText = errors.join('<br>');
                setFieldError(key, helperText);
            });
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize={true}
        >
            {children}
        </Formik>
    );
};