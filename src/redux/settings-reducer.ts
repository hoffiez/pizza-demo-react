import {AnyAction} from "redux";
import {CurrencyType, IDispatcher} from "../interfaces/interfaces";

interface ISettings{
    currency: CurrencyType,
    currency_status: 'idle' | 'loaded'
}


let initialSettingsState: ISettings = {
    currency: 'USD',
    currency_status: 'idle'
};

const settingsReducer = (state: ISettings = initialSettingsState, action: AnyAction): ISettings => {
    switch (action.type) {
        case "settings/initialState": {
            return {
                ...state,
                ...initialSettingsState
            }
        }
        case "settings/pushState": {
            return {
                ...state,
                ...action.payload.newState
            }
        }
        default:
            return state;
    }
};


export const pushNewSettingsState = (newState: Partial<ISettings>): IDispatcher => ({
    type: "settings/pushState",
    payload: {newState}
});

export const switchCurrency = (newCurrency: CurrencyType) => {
    return async (dispatch: any) => {
        await dispatch(pushNewSettingsState({
            currency: newCurrency
        }));
        window.localStorage.setItem('currency', newCurrency);
    }
};

export default settingsReducer;