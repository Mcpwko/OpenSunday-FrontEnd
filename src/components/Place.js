import React from "react";
import "./Place.css";

export default function Place(props) {
  const { name, isOpenSunday } = props;

  return (
    <div className="place">
      <h2>{name}</h2>
      <div>Open on Sunday : {isOpenSunday ? <span>✔</span> : <span>❌</span>}</div>
    </div>
  );
}
