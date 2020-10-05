import {AnyAction} from "redux";
import {IDispatcher} from "../interfaces/interfaces";
import {ISignInCredentials, ISignUpCredentials, IUser} from "../interfaces/user";
import {Api} from "../api/api";


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
    authenticated: boolean | null
}

let initialUserState: IUserState = {
    authenticated: null,
    id: 0,
    email: "",
    name: ""
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

const getUserDataFromStorage = () => {
    let userData: IUserDataStorage;
    const userDataString =  window.localStorage.getItem('user_data');
    if (userDataString === null) return null;
    userData = JSON.parse(userDataString);
    return userData;
};

const getTokenDataFromStorage = () => {
    let tokenData: ITokenData;
    const tokenDataString =  window.localStorage.getItem('token_data');
    if (tokenDataString === null) return null;
    tokenData = JSON.parse(tokenDataString);
    return tokenData;
};

const setApiAuthToken = (token: string) => {
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const authenticateUser = () => {
    return async (dispatch: any) => {
        const userData = getUserDataFromStorage();
        const tokenData = getTokenDataFromStorage();
        console.log(userData);
        console.log(tokenData);

        if (tokenData === null) {
            dispatch(pushNewUserState({
                authenticated: false
            }));
        } else {
            if (userData !== null) {
                dispatch(pushNewUserState({
                    ...userData,
                    authenticated: true
                }));
            } else {
                dispatch(pushNewUserState({
                    authenticated: true
                }));
            }


            setApiAuthToken(tokenData.auth_token);
            dispatch(updateUserData());
        }
    }
};



export const signIn = (credentials: ISignInCredentials) : any => {
    return async (dispatch: any) => {
        const response = await Api.signIn(credentials);
        saveTokenToStorage(response);
        dispatch(authenticateUser());
    }
};

export const signUp = (credentials: ISignUpCredentials) : any => {
    return async (dispatch: any) => {
        const response = await Api.signUp(credentials);
        saveUserDataToStorage(response.user);
        saveTokenToStorage(response.token);
        dispatch(authenticateUser());
    }
};

const saveTokenToStorage = (tokenData: ITokenData) => {
    window.localStorage.setItem('token_data', JSON.stringify(tokenData));
};

const saveUserDataToStorage = (user: IUser) => {
    const userDataToSave = {
        user_id: user.id,
        email: user.email,
        name: user.name,
    };
    window.localStorage.setItem('user_data', JSON.stringify(userDataToSave));

    return userDataToSave;
};

export const updateUserData = () => {
    return async (dispatch: any) => {
        try {
            const user: IUser = await Api.fetchUser();
            const userData = saveUserDataToStorage(user);
            dispatch(pushNewUserState({
                ...userData
            }));
        } catch (error){
            dispatch(clearAuthData());
        }
    }
};

const clearAuthData = () => {
    return async (dispatch: any) => {
        window.localStorage.removeItem('user_data');
        window.localStorage.removeItem('token_data');
        dispatch(pushInitialState());
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

export default userReducer;