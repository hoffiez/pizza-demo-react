import {AnyAction} from "redux";
import {IDispatcher} from "../interfaces/interfaces";
import {ISignInCredentials, ISignUpCredentials, IUser} from "../interfaces/user";
import {Api} from "../api/api";

export type CurrencyType = "USD" | "EUR" | null;

interface ITokenData{
    auth_token: string,
    expires_in: string,
    token_type: string
}

interface IUserDataStorage {
    tokenData: ITokenData,
    user_id?: number,
    email?: string
}

interface IUserState extends IUser{
    authenticated: boolean | null,
    selected_currency: CurrencyType
}

let initialUserState: IUserState = {
    authenticated: null,
    id: 0,
    email: "",
    name: "",
    selected_currency: null
};

const userReducer = (state: IUserState = initialUserState, action: AnyAction): IUserState => {
    switch (action.type) {
        case "user/initialState": {
            return {
                ...state,
                ...initialUserState
            }
        }
        case "user/pushState": {
            return {
                ...state,
                ...action.payload.newState
            }
        }
        default:
            return state;
    }
};

export const pushInitialState = (): IDispatcher => ({
    type: "user/initialState",
    payload: {}
});

export const pushNewUserState = (newState: Partial<IUserState>): IDispatcher => ({
    type: "user/pushState",
    payload: {newState}
});

export const switchCurrency = (newCurrency: CurrencyType) => {
    return async (dispatch: any) => {
        if (newCurrency === null) return;
        await dispatch(pushNewUserState({
            selected_currency: newCurrency
        }));
        window.localStorage.setItem('currency', newCurrency);
    }
};

const getUserDataFromStorage = () => {
    let userData: IUserDataStorage;
    const userDataString =  window.localStorage.getItem('user_data');
    if (userDataString === null) return null;
    userData = JSON.parse(userDataString);
    return userData;
};

const setApiAuthToken = (token: string) => {
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const authenticateUser = () => {
    return async (dispatch: any) => {
        const userData = getUserDataFromStorage();

        if (userData === null || userData.tokenData === undefined) {
            dispatch(pushNewUserState({
                authenticated: false
            }));
        } else if (
            userData.tokenData.hasOwnProperty('auth_token') &&
            userData.hasOwnProperty('user_id') &&
            userData.hasOwnProperty('email') &&
            userData.hasOwnProperty('name')
        ) {
            setApiAuthToken(userData.tokenData.auth_token);
            dispatch(pushNewUserState({
                ...userData,
                authenticated: true
            }));
            dispatch(updateUserData(userData));
        } else {
            setApiAuthToken(userData.tokenData.auth_token);
            dispatch(updateUserData(userData));
        }
    }
};


export const fetchUser = (): any => {
    return async (dispatch: any) => {
        const response = await Api.fetchUser();
        dispatch(pushNewUserState(response));
        return response;
    }
};

export const signOut = () => {
    return async (dispatch: any) => {
        try {
            await Api.signOut();
            dispatch(clearAuthData());
        } catch (error){}
    }
};

export const signIn = (credentials: ISignInCredentials) : any => {
    return async (dispatch: any) => {
        const response = await Api.signIn(credentials);
        window.localStorage.setItem('user_data', JSON.stringify({
            tokenData: response
        }));

        dispatch(authenticateUser());
    }
};

export const signUp = (credentials: ISignUpCredentials) : any => {
    return async (dispatch: any) => {
        const response = await Api.signUp(credentials);
        window.localStorage.setItem('user_data', JSON.stringify({
            tokenData: response
        }));
    }
};

export const updateUserData = (oldUserData: IUserDataStorage) => {
    return async (dispatch: any) => {
        try {
            const user: IUser = await dispatch(fetchUser());
            const newUserData =  {
                ...oldUserData,
                user_id: user.id,
                email: user.email,
                name: user.name,
                authenticated: true
            };

            window.localStorage.setItem('user_data', JSON.stringify(newUserData));
            dispatch(pushNewUserState({
                ...newUserData
            }));
        } catch (error){
            dispatch(clearAuthData());
        }
    }
};

const clearAuthData = () => {
    return async (dispatch: any) => {
        window.localStorage.removeItem('user_data');
        dispatch(pushInitialState());
    }
};

export default userReducer;