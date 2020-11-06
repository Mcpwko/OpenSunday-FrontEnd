import React, {useContext, useEffect, useState} from "react";
import "./App.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints";
import Loading from "./components-reusable/Loading";
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";
import Navigation from "./components/Navigation";
import MapView from './pages/MapView';
import About from "./pages/About";
import moment from "moment";
import Account from "./pages/Account";
import Home from "./pages/Home";
import {ThemeContext, themes} from "./context/ThemeContext";
import Places from "./pages/Places";
import {UserContext} from "./context/UserContext";
import {useAlert} from "react-alert";
import {Modal} from "react-bootstrap";
import Terms from "./pages/Terms";

function App() {
    //List of all places
    let [locations, setLocations] = useState([]);
    //Connected User
    let [userConnected, setUserConnected] = useState({});
    let [showBan, setShowBan] = useState(false);
    /*Hooks*/
    //Variables for Auth0
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
        user,
    } = useAuth0();
    /*Context*/
    const themeContext = useContext(ThemeContext);
    const userContext = useContext(UserContext);

    //Hooks which checks if user is connected to POST Check
    useEffect(() => {

        if (isAuthenticated) {
            //POST user
            fetchUser();
            getConnectedUser();
        }

    }, [isAuthenticated]);

    //Handle click on "Login" to open Auth0 Popup Login
    let handleLoginClick = async (e) => {
        e.preventDefault();
        console.log("Test")
        await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.user}`,
            getAccessTokenSilently,
            loginWithRedirect
        );


    };


//Method to get the connected user in the DB
    let getConnectedUser = async () => {

        let connectedUser = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.user}${'/' + user.name}`,
            getAccessTokenSilently, loginWithRedirect
        );
        setUserConnected(connectedUser);
        if (connectedUser.status == 1) {
            setShowBan(true)
            setInterval(function () {
                logout({returnTo: window.location.origin})
            }, 3000)
        }


    };

    //Method to POST the user in the DB
    let fetchUser = async () => {

        let token = await getAccessTokenSilently();
        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.user}`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                'Content-Type': "application/json",
            }, body: JSON.stringify({
                email: user.name,
                pseudo: null,
                createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
                status: "0",
                idAuth0: user.sub,
                idUserType: "1"
            })
        });

    };


    //Handle click on "Logout"
    let handleLogoutClick = async (e) => {
        e.preventDefault();
        /*
        returnTo parameter is necessary because multiple
        apps use the same authentication backend
        */
        logout({returnTo: window.location.origin});
    };


    if (loading) {
        return <Loading/>;
    }

    const authUser = () => {
        return (
            <div>
                {isAuthenticated ?
                    <div>
                        <Link
                            style={{paddingRight: "2em"}}
                            to="/account"
                        >
                            My account
                        </Link>
                        <a
                            className="App-link Logout-link"
                            href="#"
                            style={{color: "#61dafb"}}
                            onClick={handleLogoutClick}
                        >
                            {user.name} - Logout
                        </a>
                    </div>
                    :
                    <a className="App-link"
                       href="#"
                       style={{color: "#61dafb"}}
                       onClick={handleLoginClick}>
                        login
                    </a>
                }
            </div>
        );
    }

    const hide = () => {
        //Blocking the banned user
    }


    return (
        <UserContext.Provider value={{user: userConnected, refresh: getConnectedUser, refreshPlaces: null}}>
            <div className="App">
                <BrowserRouter>

                    <Navigation auth={authUser()}/>

                    <header className="App-header"
                            style={{
                                backgroundColor: themes[themeContext.theme].background,
                                color: themes[themeContext.theme].foreground
                            }}>

                        <Switch>
                            <Route
                                /*
                                FOR HOME
                                */
                                path="/"
                                exact
                                render={() => (
                                    <>


                                        <Home/>
                                    </>
                                )}
                            />
                            <Route path="/map" component={MapView} props={locations}></Route>
                            <Route path="/about" component={About}/>
                            <Route path="/account" component={Account}/>
                            <Route path="/places" component={Places}/>
                            <Route path="/terms-of-use" component={Terms}/>
                        </Switch>

                    </header>

                    <Modal show={showBan} onHide={hide}>
                        <Modal.Header>
                            <Modal.Title>BANNED</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>You have been banned ! You will be disconnected in 3 sec !</Modal.Body>
                    </Modal>

                    <footer style={{
                        backgroundColor: themes[themeContext.theme].background,
                        color: themes[themeContext.theme].foreground
                    }}> ©COPYRIGHT 2020 - Brice Berclaz, Mickaël Puglisi, Ludovic Sahraoui -
                        <Link
                            style={{paddingRight: "2em"}}
                            to="/terms-of-use"
                        >
                            Terms of use
                        </Link>
                    </footer>
                </BrowserRouter>
            </div>
        </UserContext.Provider>
    );
}


export default App;
