import React from "react";
import "./Location.css";

export default function Location(props) {
  const { name, isOpen } = props;

  return (
    <div className="location">
      <h2>{name}</h2>
      <div>Open on Sunday : {isOpen ? <span>✔</span> : <span>❌</span>}</div>
    </div>
  );
}
