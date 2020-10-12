import React, {Component, useEffect, useState} from 'react';
import "../pages/MapView.css"
import useGeolocation from 'react-hook-geolocation'

var foursquare = require('react-foursquare')({
    clientID: 'RLSLS4THQUA21LHLRQXJYGUHHRQUMU5PLTS5BWJZBZBO2X0Q',
    clientSecret: 'NBJERYXFQPGHZIREAYAT44UOIJFEQHNVTVWKMJ33BCA4ZQ12'
});


export default function Foursquare(props) {
    const geolocation = useGeolocation()
    let [items,setitems] = useState([]);
    let [params,setparams] = useState(
        {
            "ll": "46.5, 16.2",
            "radius":"1000",
            "limit":"100"
        });

    useEffect(()=>{
        /*foursquare.venues.getVenues(params).then(res => {
            setitems(res.response.venues);
        },[params]);*/
    });



    return (
        <div className="listVenues">
            <div>Items:</div>
            <ul>
                { items!=null && items.map(items => { return <li key={items.id}>{items.name}</li>}) }
            </ul>
        </div>
    )

}

