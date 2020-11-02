import React, {useContext, useEffect, useState} from "react";
import "./App.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints";
import Loading from "./components-reusable/Loading";
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";
import PlaceDetails from "./pages/PlaceDetails";
import Navigation from "./components/Navigation";
import MapView from './pages/MapView';
import About from "./pages/About";
// import {FormPlace} from "./components/FormPlace"
// import {GetLocation} from "./components/GetLocation"
import moment from "moment";
import {forEach} from "react-bootstrap/ElementChildren";
import {get} from "leaflet/src/dom/DomUtil";
import Account from "./pages/Account";
import {ThemeContext, themes} from "./context/ThemeContext";
import {UserContext} from "./context/UserContext";

function App() {
    //List of all places
    let [locations, setLocations] = useState([]);

    //Variables for Auth0
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
        user,
    } = useAuth0();
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



    // const [isOpen, setIsOpen] = useState(false);
    //
    // const toggle = () => setIsOpen(!isOpen);

    //Handle click for "Get Locations" button
    let handleLocationsClick = async (e) => {
        e.preventDefault();
        let locations = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.places}`,
            getAccessTokenSilently,
            loginWithRedirect
        );


        if (locations && locations.length > 0) {
            console.log(locations);
            setLocations(locations);
        }
    };
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
            `${process.env.REACT_APP_SERVER_URL}${endpoints.user}${'/'+user.name}`,
            getAccessTokenSilently
        );

        userContext.user = connectedUser;
        console.log( userContext.user);
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
            // <br/>
        );
    }


    return (
        <div className="App">
            <BrowserRouter>

                <Navigation auth={authUser()}/>

                <header className="App-header"
                        style={{
                            backgroundColor: themes[themeContext.theme].background,
                            color: themes[themeContext.theme].foreground
                        }}>
                    {/*{isAuthenticated && (*/}
                    {/*    <a*/}
                    {/*        className="App-link Logout-link"*/}
                    {/*        href="#"*/}
                    {/*        onClick={handleLogoutClick}*/}
                    {/*    >*/}
                    {/*        {user.name}*/}
                    {/*        Logout*/}
                    {/*    </a>*/}
                    {/*)}*/}
                    {/*<br/>*/}

                    <Switch>
                        <Route
                            /*
                            FOR DEV FACILITIES - PLEASE CHANGE THE PATH
                            */
                            path="/"
                            // path="/activities"
                            exact
                            render={() => (
                                <>

                                    <h1>Welcome on OpenSunday</h1>
                                    {/*<ContactForm/>*/}
                                    {/*<FormPlace/>*/}
                                    <a
                                        className="App-link"
                                        href="#"
                                        onClick={handleLocationsClick}
                                    >
                                        Get Locations
                                    </a>
                                    {locations && locations.length > 0 && (
                                        <ul className="Locations-List">
                                            {locations.map((location) => (
                                                <li key={location.id}>
                                                    <Link
                                                        className="App-link"
                                                        to={`/location/${location.id}`}
                                                    >
                                                        {location.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        />
                        <Route path="/location/:id" component={PlaceDetails}/>
                        <Route path="/map" component={MapView} props={locations}></Route>
                        <Route path="/about" component={About}/>
                        <Route path="/account" component={Account}/>
                    </Switch>

                </header>
                <footer style={{
                    backgroundColor: themes[themeContext.theme].background,
                    color: themes[themeContext.theme].foreground
                }}> COPYRIGHT 2020 - Brice Berclaz, Mickaël Puglisi, Ludovic Sahraoui
                </footer>
            </BrowserRouter>
        </div>
    );
}

export default App;
