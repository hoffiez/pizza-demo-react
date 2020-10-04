import React from "react";
import {Card, CardActions, CardContent, CardMedia} from "@material-ui/core";
import {IProduct} from "../../interfaces/product";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import classes from "./ProductCard.module.scss";
import {truncateString} from "../../utils/Strings";
import {useDispatch} from "react-redux";
import {setItemQuantity} from "../../redux/cart-reducer";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    media: {
        height: 140,
    }
});


interface IProductCard {
    product: IProduct
}

export const ProductCard = ({product}: IProductCard) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product: IProduct) => {
        dispatch(setItemQuantity(product));
    };

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={product.img_url || ''}
                title={product.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {product.title}
                </Typography>
                <Typography variant="body2" component="p">
                    {product.description !== null && truncateString(product.description, 100)}
                </Typography>
                <Typography variant="h5" component="div" className="mt-2">
                    {product.price}$
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleAddToCart(product)}
                >
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    );
};