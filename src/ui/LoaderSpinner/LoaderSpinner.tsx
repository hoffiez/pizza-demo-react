import React, {useState} from "react";
import {CircularProgress} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    root: {
        background: '#fff',
        opacity: 0.7,
        width: '100%',
        height: '100%',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export const LoaderSpinner = () => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <CircularProgress color="secondary" style={{margin: 'auto'}}/>
        </div>
    )
};