export interface IUser{
    id: number,
    email: string,
    name: string
}

export interface ISignInCredentials {
    email: string,
    password: string
}

export interface ISignUpCredentials {
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    pd_agreement: boolean
}