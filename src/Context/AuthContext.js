import React, {createContext, useContext} from 'react'
import {useAuth0} from "@auth0/auth0-react";


 let {
     loading,
     loginWithRedirect,
     logout,
     getAccessTokenSilently,
     isAuthenticated,
     user,
 } = useAuth0();

 const auth = {
     loading: loading,
     loginWithRedirect: loginWithRedirect,
     logout: logout,
     getAccessTokenSilently: getAccessTokenSilently,
     isAuthenticated: isAuthenticated,
     user: user,
 }

export const AuthContext = createContext(auth);
