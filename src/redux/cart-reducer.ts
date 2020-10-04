import {AnyAction} from "redux";
import {IDispatcher} from "../interfaces/interfaces";
import {IProduct} from "../interfaces/product";
import {Api} from "../api/api";

export interface ICartItem{
    id: number,
    title: string,
    price: string,
    quantity: number,
    img_url: string | null
    subtotal: number
}

export interface ICartTotals {
    tax_value: string,
    subtotal: string,
    total: string
}

export interface ICartState extends ICartTotals{
    products: ICartItem[],
    tax_percentage: number,
    delivery_price: number,
    loading: boolean
}

let initialCartState: ICartState = {
    products: [],
    delivery_price: 5,
    subtotal: '',
    tax_value: '',
    tax_percentage: 19,
    total: '',
    loading: false
};

const roundNumber = (num: number): number => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

const getCartTotals = (prevState: ICartState, updatedItems: ICartItem[]): ICartTotals => {
    let subtotal = 0;

    updatedItems.forEach(item => {
        subtotal += item.subtotal;
    });

    const taxValue = roundNumber(subtotal * prevState.tax_percentage / 100);
    const delivery = 5;
    const total = subtotal + taxValue + delivery;

    return {
        subtotal: subtotal.toFixed(2),
        tax_value: taxValue.toFixed(2),
        total: total.toFixed(2)
    }
};

const cartReducer = (state: ICartState = initialCartState, action: AnyAction): ICartState => {
    switch (action.type) {
        case "cart/setInitialState": {
            return {
                ...state,
                ...initialCartState
            }
        }
        case "cart/pushState": {
            return {
                ...state,
                ...action.payload.newState
            }
        }
        case "cart/setItemQuantity": {
            const itemToUpdate: ICartItem & IProduct = action.payload.itemToUpdate;
            let newQuantity: number | null = action.payload.newQuantity;

            let itemExists = false;
            const updatedItems = state.products.map(item => {
                if (item.id === itemToUpdate.id) {
                    itemExists = true;

                    if (newQuantity === null){
                        newQuantity = item.quantity + 1;
                    }

                    return {
                        ...item,
                        quantity: newQuantity,
                        subtotal: roundNumber(+item.price * newQuantity)
                    }
                }

                return item;
            });

            if (!itemExists) {
                updatedItems.push({
                    id: itemToUpdate.id,
                    title: itemToUpdate.title,
                    price: itemToUpdate.price,
                    quantity: 1,
                    img_url: itemToUpdate.img_url,
                    subtotal: +itemToUpdate.price
                })
            }

            return {
                ...state,
                products: updatedItems,
                ...getCartTotals(state, updatedItems)
            };
        }
        case "cart/removeItem": {
            const removeItemId: number = action.payload.removeItemId;

            return {
                ...state,
                products: state.products.filter((item) => item.id !== removeItemId)
            };
        }
        default:
            return state;
    }
};

export const pushNewState = (newState: ICartState): IDispatcher => ({
    type: "cart/pushState",
    payload: {newState}
});


const removeFromCart = (removeItemId: number): IDispatcher => ({
    type: "cart/removeItem",
    payload: {removeItemId}
});

const setCartItemQuantity = (itemToUpdate: ICartItem | IProduct, newQuantity: number | null = null): IDispatcher => ({
    type: "cart/setItemQuantity",
    payload: { itemToUpdate, newQuantity }
});


export const removeItemFromCart = (removeItemId: number) => {
    return async (dispatch: any) => {
        dispatch(removeFromCart(removeItemId));
        updateCartStorage();
    }
};

export const setItemQuantity = (updatedItem: ICartItem | IProduct, newQuantity: number | null = null) => {
    return async (dispatch: any, getState: any) => {
        dispatch(setCartItemQuantity(updatedItem, newQuantity));

        const response = await Api.calculateCart(getState().cart);
        console.log(response);
        dispatch(pushNewState(response));

        dispatch(updateCartStorage());
    }
};

export const updateCartStorage = () => {
    return async (dispatch: any, getState: any) => {
        const cartData = getState().cart;
        localStorage.setItem('cart_data', JSON.stringify(cartData));
    }
};

export const pushCartStateFromStorage = () => {
    return async (dispatch: any) => {
        const cartData = localStorage.getItem('cart_data');

        if (cartData) {
            dispatch(pushNewState(JSON.parse(cartData)));
        }
    }
};

export const clearCart = () => {
    return async (dispatch: any) => {
        dispatch({
            type: "cart/setInitialState",
            payload: {}
        });
        localStorage.removeItem('cart_data');
    }
};

export default cartReducer;