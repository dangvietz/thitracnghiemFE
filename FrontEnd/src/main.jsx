import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import GlobalStyle from "./globalStyle";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router basename={process.env.PUBLIC_URL}>
                <App />
                <GlobalStyle />
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
