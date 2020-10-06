import React from "react";
import {Card, CardActions, CardContent, CardMedia} from "@material-ui/core";
import {IProduct} from "../../interfaces/product";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import classes from "./ProductCard.module.scss";
import {truncateString} from "../../utils/Strings";
import {useDispatch} from "react-redux";
import {setItemQuantity} from "../../redux/cart-reducer";
import {Lang} from "../../utils/Lang";
import {useSnackbar} from "notistack";

interface IProductCard {
    product: IProduct
}

export const ProductCard = ({product}: IProductCard) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleAddToCart = (product: IProduct) => {
        dispatch(setItemQuantity(product));

        enqueueSnackbar(product.title + ' added to cart', {variant: 'success'});
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
            </CardContent>
            <CardActions className="flex-column">
                <Typography variant="h5" component="div" className="mb-3">
                    {product.price} {Lang.currency[product.currency]}
                </Typography>
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