import React, {useState} from "react";
import "./App.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints";
import Loading from "./components/Loading";
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";
import PlaceDetails from "./pages/PlaceDetails";
import Navigation from "./components/Navigation";
import MapView from './pages/MapView';
import About from "./pages/About";
import {FormPlace} from "./components/FormPlace"

function App() {
    let [locations, setLocations] = useState([]);

    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
        user,
    } = useAuth0();

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

    return (
        <div className="App">

            <Navigation/>


            <header className="App-header">
                {isAuthenticated && (
                    <a
                        className="App-link Logout-link"
                        href="#"
                        onClick={handleLogoutClick}
                    >
                        {user.name}
                        Logout
                    </a>
                )}


                <br/>
                <BrowserRouter>
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
                            <Route path="/map" exact component={MapView} props={locations}></Route>
                        <Route path="/about" component={About}/>
                    </Switch>
                </BrowserRouter>
            </header>
        </div>
    );
}

export default App;
