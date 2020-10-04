import {CurrencyType} from "../redux/user-reducer";

export interface IProduct {
    id: number,
    title: string,
    description: string | null,
    price: string,
    quantity: number,
    img_url: string | null,
    currency: CurrencyType
}