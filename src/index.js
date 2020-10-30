import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import auth_config from './auth_config';
import {Auth0Provider} from "@auth0/auth0-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {positions, Provider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import AppWrapper from "./AppWrapper";

const options = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER
};

const Application = () => (
    <Provider template={AlertTemplate} {...options}>
        <AppWrapper>
            <App/>
        </AppWrapper>
    </Provider>
);

ReactDOM.render(
    // <React.StrictMode>
    <Auth0Provider
        domain={auth_config.domain}
        clientId={auth_config.clientId}
        redirectUri={window.location.origin}
        audience={auth_config.audience}
        useRefreshTokens={true}
    >
        <Application/>
    </Auth0Provider>,
    // </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
