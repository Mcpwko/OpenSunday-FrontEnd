import React from "react";
import {Link} from "react-router-dom";
import UserAccount from "../components/UserAccount";

export default function Account(props) {



    return (
        <div className="place">

            <UserAccount/>

            <Link className="App-link" to="/">
                Go back
            </Link>
        </div>
    );
}