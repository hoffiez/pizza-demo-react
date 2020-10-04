import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {Provider as ReduxProvider} from 'react-redux';
import store from "./redux/redux-store";
import {ThemeProvider} from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ff6n735'
        },
        secondary: {
            main: '#f44343'
        },
    },
});

ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
          <ReduxProvider store={store}>
              <BrowserRouter>
                    <App />
              </BrowserRouter>
          </ReduxProvider>
      </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
