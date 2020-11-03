import React from "react";
import "./Place.css";

export default function Place(props) {
    const {name, isOpenSunday, isOpenSpecialDay} = props;

    return (
        <div className="place">
            <h2>{name}</h2>
            <div>Open on Sunday : {isOpenSunday ? <span>✔</span> : <span>❌</span>}</div>
            <div>Open on Special Day : {isOpenSpecialDay ? <span>✔</span> : <span>❌</span>}</div>
        </div>
    );
}
