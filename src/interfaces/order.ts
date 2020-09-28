import {CurrencyType} from "../redux/user-reducer";


export interface IOrder {
    id: number,
    subtotal: string,
    tax: string,
    delivery_price: string,
    sum_total: string,
    recipient_name: string,
    recipient_email: string,
    recipient_country: string,
    recipient_state: string,
    recipient_city: string,
    recipient_address: string,
    currency: string,
    payment_method: 'cash_delivery' | 'card_online',
    products: IOrderProduct[]
}

export interface IOrderProduct {
    id: number,
    title: string,
    pivot: {
        buy_price: string,
        quantity: number,
        subtotal: string
    }
}

export interface ICheckoutPostData{
    products: {
        id: number, quantity: number
    }[],
    name: string,
    email: string,
    recipient_country: string,
    recipient_state: string,
    recipient_city: string,
    recipient_address: string,
    payment_method: 'cash_delivery'  | 'card_online',
    password: string,
    password_confirmation: string,
    currency: CurrencyType,
    signup: boolean
}