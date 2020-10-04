import {ISignInCredentials} from "../interfaces/user";
import axios from "axios";
import {ICheckoutPostData} from "../interfaces/order";
import {ICartState} from "../redux/cart-reducer";

export const Api = {
    async getProducts(params?: any) {
        return await axios.get('/products', {
            params: params
        });
    },
    async createOrder(params: ICheckoutPostData) {
        return (await axios.post('/orders', params)).data;
    },
    async getOrders() {
        return (await axios.get('/orders')).data;
    },
    async signIn(credentials: ISignInCredentials) {
        return (await axios.post('/signin', credentials)).data;
    },
    async signUp(params: ISignInCredentials) {
        return (await axios.post('/signup', params)).data;
},
    async signOut(){
        return (await axios.post('/signout')).data;
    },
    async fetchUser() {
        return (await axios.get('/user')).data;
    },
    async calculateCart(cartData: any) {
        return (await axios.post('/calculateCart', cartData)).data;
    }
};