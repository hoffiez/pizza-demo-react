import React from "react";
import {FormControl, IconButton, InputLabel, MenuItem, Select} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/redux-store";
import {ShoppingCart} from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";
import {Link, useHistory} from "react-router-dom";
import {RoutesCreator} from "../../utils/RoutesCreator";
import Button from "@material-ui/core/Button";
import {CurrencyType, signOut, switchCurrency} from "../../redux/user-reducer";

export const UserNavigation = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart);
    const user = useSelector((state: RootState) => state.user);
    const history = useHistory();

    let countItems = 0;

    if (cart.products.length > 0) {
        countItems = cart.products.reduce((t, {quantity}) => t + quantity, 0);
    }

    return (
        <div className="d-flex align-items-center">
            <FormControl>
                <Select
                    value={user.selected_currency}
                    onChange={(e) => dispatch(switchCurrency(e.target.value as CurrencyType))}
                >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                </Select>
            </FormControl>
            <Link to={RoutesCreator.cart()}>
                <IconButton className="mx-2">
                    <Badge badgeContent={countItems} color="secondary">
                        <ShoppingCart fontSize="large" />
                    </Badge>
                </IconButton>
            </Link>

            {!user.authenticated ? (
                <>
                    <Button size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() => history.push(RoutesCreator.signIn())}
                    >
                        Sign In
                    </Button>
                    <Button size="small"
                            variant="contained"
                            color="secondary"
                            className="ml-2"
                            onClick={() => history.push(RoutesCreator.signUp())}
                    >
                        Sign Up
                    </Button>
                </>
            ) : (
                <>
                    <Button size="small"
                            variant="contained"
                            color="secondary"
                            className="mx-1"
                            onClick={() => history.push(RoutesCreator.ordersHistory())}
                    >
                        My orders
                    </Button>
                    <Button size="small"
                            variant="outlined"
                            className="mx-1"
                            color="secondary"
                            onClick={() => dispatch(signOut())}
                    >
                        Logout
                    </Button>
                </>
            )}


        </div>
    )
};