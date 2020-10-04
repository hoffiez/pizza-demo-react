import React, {useState} from 'react';
import {Form, Formik} from "formik";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    TextField
} from "@material-ui/core";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Alert} from "@material-ui/lab";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import Radio from "@material-ui/core/Radio/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Preloader from "../Preloader/Preloader";


export type WidthType = boolean | 2 | "auto" | 3 | 1 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface IGridDefault{
    lg: WidthType,
    md: WidthType,
    sm: WidthType,
    xs: WidthType
}

interface IGrid{
    lg?: WidthType,
    md?: WidthType,
    sm?: WidthType,
    xs?: WidthType
}

interface IOption{
    label: string,
    value: string
}

interface IAutocompleteSettings{
    fetchFunction: any,
    getOptionLabel: (option: any) => string,
    defaultValue: any
}

export interface IField{
    type:
        'text'
        | 'checkbox'
        | 'radio'
        | 'select'
    ,
    label: string,
    name: string,
    required: boolean,
    onChange?: any,
    grid?: IGrid,
    props?: any,
    options?: IOption[],
    autocompleteSettings?: IAutocompleteSettings,
    style?: any,
    subFields?: IField[],
    tooltip?: string,
    showIf?: {
        field: string,
        condition: 'eq' | 'neq' | 'gt' | 'lt',
        value: string | string[]
    },
    link? :{
        anchor: string,
        url: string
    }
}

interface IProps{
    fields?: IField[],
    initialValues: any,
    handleSubmit: any,
    children?: any,
    classes: any,
    submitText?: string,
    uploadFile?: any,
    deleteFile?: any,
    formId?: string,
    getSettings?: any
}

const FormBuilder = ({  fields,
                        initialValues,
                        handleSubmit,
                        children,
                        submitText,

                        getSettings
}: IProps) => {
    const [formValues] = useState(initialValues);
    const [preLoading] = useState( false);
    const [fieldSettings] = useState(fields || []);
    const [setLoading] = useState(false);



    const defaultGrid: IGridDefault = {
        lg: 3,
        md: 4,
        sm: 6,
        xs: 12
    };


    const myHandleSubmit = async (values: any, {setFieldError, setStatus, resetForm, setSubmitting} : any) => {
        try {
            const response = await handleSubmit(values);
            resetForm();
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


    const renderItem = (field: IField, {values, handleChange, errors, touched, setFieldValue} : any) => {


        return <Grid item
                     // key={field.name}
                  lg={field.grid?.lg || defaultGrid.lg}
                  md={field.grid?.md || defaultGrid.md}
                  sm={field.grid?.sm || defaultGrid.sm}
                  xs={field.grid?.xs || defaultGrid.xs}
                     {...field.showIf &&
                         (
                             (field.showIf.condition === 'eq' && Array.isArray(field.showIf.value) &&
                                 !field.showIf.value.includes(values[field.showIf.field])) ||
                             (field.showIf.condition === 'neq' && Array.isArray(field.showIf.value) &&
                                 field.showIf.value.includes(values[field.showIf.field])) ||
                             (field.showIf.condition === 'eq' && !Array.isArray(field.showIf.value) &&
                                 values[field.showIf.field] !== field.showIf.value) ||
                             (field.showIf.condition === 'neq' && !Array.isArray(field.showIf.value) &&
                                 values[field.showIf.field] === field.showIf.value) ||
                             (field.showIf.condition === 'gt' && values[field.showIf.field] <= field.showIf.value) ||
                             (field.showIf.condition === 'lt' && values[field.showIf.field] >= field.showIf.value)
                         )
                         && {style: {display: 'none'}}
                     }



            >
                {field.type === 'text' ? (
                    <TextField
                        // Название товара (70 симв.)
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        onBlur={field.onChange || handleChange}
                        values={values}
                        {...field.props}
                        required={field.required}
                        {...errors[field.name] && touched[field.name] && {error: true, helperText: errors[field.name]}}
                        defaultValue={values[field.name]}
                    />
                ) : field.type === 'select' ? (
                    <FormControl {...field.style && {style: field.style}}>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={values[field.name]}
                            name={field.name}
                            onChange={field.onChange || handleChange}
                            {...errors[field.name] && touched[field.name] &&
                            {error: true, helperText: errors[field.name]}}
                            {...field.props}
                        >
                            {field.options !== undefined ? field.options.map((option: IOption) =>
                                <MenuItem value={option.value}>{option.label}</MenuItem>
                            ): ''}
                        </Select>
                    </FormControl>
                ) : field.type === 'checkbox' ? (
                    <>
                        <FormControlLabel
                            key={field.name}
                            control={
                                <Checkbox checked={values[field.name]}
                                          onChange={field.onChange || handleChange}
                                          name={field.name}
                                />
                            }
                            {
                                ...field.link ?
                                {label: <>{field.label}
                                <a href={field.link.url} target="_blank">{field.link.anchor}</a> {field.required && '*'}
                                    </>} :
                                {label: <>{field.label} {field.required && '*'}</>}
                            }

                        />
                        {touched[field.name] && errors[field.name] && (
                            <FormHelperText
                                className="mb-2"
                                {...errors[field.name] && {error: true}}
                            >
                                {errors[field.name]}
                            </FormHelperText>
                        )}
                    </>
                ) : field.type === 'radio' ? (
                    <>
                        {field.label.length > 0 &&  <FormLabel>{field.label} {field.required && '*'}</FormLabel>}
                        <RadioGroup aria-label="category" name={field.name} value={values[field.name]} row>
                            {field.options && field.options.map((item: IOption) =>
                                <FormControlLabel
                                    control={<Radio />}
                                    value={item.value}
                                    label={item.label}
                                    onChange={handleChange}
                                />
                            )}
                        </RadioGroup>
                        {touched[field.name] && errors[field.name] && (
                                <FormHelperText
                                    className="mb-2"
                                    {...errors[field.name] && {error: true}}
                                >
                                    {errors[field.name]}
                                </FormHelperText>
                            )}
                    </>
                ) : field.type === 'heading' ? (
                        <h3>{field.label}</h3>
                ) : field.type === 'headingMini' ? (
                    <h5 style={{margin: 0}}>{field.label}</h5>
                ) : field.type === 'multipleCheckboxes' ? (
                    <FormControl>
                        <FormLabel>{field.label} {field.required && '*'}</FormLabel>
                        <FormGroup {...field.props?.row && {row: true}}>
                            {field.options && field.options.map((option: IOption) => (
                                <FormControlLabel
                                    control={<Checkbox onChange={handleChange} value={option.value} name={field.name} />}
                                    label={option.label}
                                />
                            ))}
                        </FormGroup>
                        {touched[field.name] && errors[field.name] && (
                            <FormHelperText
                                className="mb-2"
                                {...errors[field.name] && {error: true}}
                            >
                                {errors[field.name]}
                            </FormHelperText>
                        )}
                    </FormControl>
                ) : field.type === 'file' ? (
                    <FormControl>
                        <FormLabel>{field.label}</FormLabel>
                        <input
                            type="file"
                            name={field.name}
                            id={"form_file_" + field.name}
                            onChange={(event:any) => {
                                setFieldValue(field.name, event.currentTarget.files[0]);
                            }}
                        />
                        {touched[field.name] && errors[field.name] && (
                            <FormHelperText
                                className="mb-2"
                                {...errors[field.name] && {error: true}}
                            >
                                {errors[field.name]}
                            </FormHelperText>
                        )}
                    </FormControl>
                ) : ''}
            </  Grid>
    };


    return (
        <>
            {preLoading ? <Preloader page="form"/> :
                <>
                <Formik
                    initialValues={formValues}
                    onSubmit={myHandleSubmit}
                    validateOnBlur={false}

                    // validateOnChange={true}


                >
                    {({values, handleChange, errors, touched, isSubmitting, setFieldValue, status}) => (
                        <Form>
                            <Grid container spacing={4}>
                                {fieldSettings.map((field: IField) => {
                                    return renderItem(field, {values, handleChange, errors, touched, setFieldValue});
                                })}
                            </Grid>
                            {children}

                            <Grid container
                                  spacing={2}
                                  justify="flex-end"
                                  alignItems="center"
                                  className={"mt-2"}
                            >
                                <Grid item
                                      alignItems={'center'}
                                >
                                    {status && (
                                        <Alert {...status.status === 'error' ? {severity: "error"} : {severity: "success"}}>
                                            {status.message}
                                        </Alert>)}
                                </Grid>
                                <Grid item>
                                    <Button
                                        type="submit"
                                        color="secondary"

                                        variant="contained"
                                        disabled={
                                            isSubmitting
                                        }
                                    >
                                        {!isSubmitting ? ''
                                            : <CircularProgress style={{marginRight: '8px'}}
                                                                color="secondary"
                                                                size={20}/>
                                        }
                                        <span>{submitText || 'Сохранить'}</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
                </>
            }
        </>
    );

};

export default FormBuilder;