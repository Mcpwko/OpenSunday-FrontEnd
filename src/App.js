import React, {useState} from "react";
import "./App.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints";
import Loading from "./components/Loading";
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";
import PlaceDetails from "./pages/PlaceDetails";
import Navigation from "./components/Navigation";
import MapView from './components/MapView';

function App() {
  let [locations, setLocations] = useState([]);

  let {
    loading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
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
                Logout
              </a>
          )}
          <MapView/>
          <h1>OpenSunday</h1>
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
            </Switch>
          </BrowserRouter>
        </header>
      </div>
  );
}

export default App;
