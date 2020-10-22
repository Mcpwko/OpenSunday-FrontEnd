import React, {useEffect, useState} from 'react';
import axios from 'axios';


export function GetLocation(props) {
    const [location, setLocation] = useState(null);

    let url = "https://us1.locationiq.com/v1/search.php?key=pk.a9fb192a815fa6985b189ffe5138383b&q=";
    let endUrl = "&format=json";
    let addr = "Ch.%20des%20An%C3%A9mones%206%2C%203960%20Sierre";

    const myRequest = url + addr + endUrl;

    let address = props.address
    let zip = props.zip
    let city = props.city
    const searchString = address + " " + zip + " " + city;
    console.log(searchString);

    // const myRequest = url + searchString + endUrl;

    let latitude=null;
    let longitude=null;

    //UNCOMMENT
    // const fetchData = async () => {
    //     const response = await axios.get(
    //         // myRequest
    //     );
    //
    //     setLocation(response.data);
    //     // console.log(location.toString());
    // };

    function transformData () {
        // {location.data[0].lat}

        // latitude = location.data[0].lat;
        // longitude = location.data[0].lon;




        {location &&
        location.map((place) => {
            // const cleanedDate = new Date(place.released).toDateString();
            // const authors = place.authors.join(', ');

            latitude=place.lat;
            longitude=place.lon;

            // return (
            //     <div className="place" key={index}>
            //         <h3>place {index + 1}</h3>
            //         <h2>{place.name}</h2>
            //
            //         <div className="details">
            //             <p>👨: {place.lat}</p>
            //             {/*<p>📖: {place.numberOfPages} pages</p>*/}
            //             {/*<p>🏘️: {place.country}</p>*/}
            //             {/*<p>⏰: {cleanedDate}</p>*/}
            //         </div>
            //     </div>
            // );
        })}
    };

    // fetchData();
    transformData();

    return latitude + "," + longitude;
    //
    // let myPlace = transformData();
    //
    //
    //
    // console.log("MY PLACE : "+ myPlace);
    //
    // return myPlace;


    // return (
    //     {fetchData}
    //     // <div className="App">
    //     //     <h1>Game of Thrones places</h1>
    //     //     <h2>Fetch a list from an API and display it</h2>
    //     //
    //     //     {/* Fetch data from API */}
    //     //     <div>
    //     //         <button className="fetch-button" onClick={fetchData}>
    //     //             Fetch Data
    //     //         </button>
    //     //         <br />
    //     //     </div>
    //     //
    //     //     {/* Display data from API */}
    //     //     <div className="places">
    //             {location &&
    //             location.map((place, index) => {
    //                 // const cleanedDate = new Date(place.released).toDateString();
    //                 // const authors = place.authors.join(', ');
    //
    //                 return (
    //                     <div className="place" key={index}>
    //                         <h3>place {index + 1}</h3>
    //                         <h2>{place.name}</h2>
    //
    //                         <div className="details">
    //                             <p>👨: {place.lat}</p>
    //                             {/*<p>📖: {place.numberOfPages} pages</p>*/}
    //                             {/*<p>🏘️: {place.country}</p>*/}
    //                             {/*<p>⏰: {cleanedDate}</p>*/}
    //                         </div>
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //
    //
    //     </div>
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // IT WORKS
    //
    //
    // return(
    //     <div className="App">
    //         <h1>Game of Thrones places</h1>
    //         <h2>Fetch a list from an API and display it</h2>
    //
    //         {/* Fetch data from API */}
    //         <div>
    //             <button className="fetch-button" onClick={fetchData}>
    //                 Fetch Data
    //             </button>
    //             <br />
    //         </div>
    //
    //         {/* Display data from API */}
    //         <div className="places">
    //             {location &&
    //             location.map((place, index) => {
    //                 // const cleanedDate = new Date(place.released).toDateString();
    //                 // const authors = place.authors.join(', ');
    //
    //                 return (
    //                     <div className="place" key={index}>
    //                         <h3>place {index + 1}</h3>
    //                         <h2>{place.name}</h2>
    //
    //                         <div className="details">
    //                             <p>👨: {place.lat}</p>
    //                             {/*<p>📖: {place.numberOfPages} pages</p>*/}
    //                             {/*<p>🏘️: {place.country}</p>*/}
    //                             {/*<p>⏰: {cleanedDate}</p>*/}
    //                         </div>
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //
    //
    //     </div>
    // );
}