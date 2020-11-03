import React from 'react';

export const UserContext = React.createContext({
    user: null,
    changes: true,
    reviewChange: false,
    reportChange: false
});