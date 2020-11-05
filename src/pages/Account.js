import React from "react";
import {Link} from "react-router-dom";
import UserAccount from "../components/UserAccount";
import {ThemeContext} from '../context/ThemeContext';

/* Navbar component to switch theme */
class ThemeManager extends React.Component {
    render() {
        return (
            <div>
                <button
                    type="button"
                    title="Switch Theme"
                    onClick={this.context.toggleTheme}
                    style={{borderRadius: "50%"}}
                >
                    {/* Remove the current theme value from the button text */}
                    <span>💡</span>
                </button>
            </div>
        );
    }
}

/* Set the contextType to ThemeContext*/
ThemeManager.contextType = ThemeContext;

export default function Account(props) {


    return (
        <>
            <ThemeManager/>
            <div className="place">


                <UserAccount/>

                <Link className="App-link" to="/">
                    Go back
                </Link>
            </div>
        </>
    );
}