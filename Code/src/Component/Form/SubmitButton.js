import React from "react";

export default function SubmitButton(props) {
  return (
    <>
      <button
        type={props.type}
        className={props.className}
        disabled={props.disabled}
        style={{backgroundColor:props.color?props.color:""}}
      >
        {props.name}
        {props.disabled && (
          <i className="fa fa-spinner fa-spin" style={{ marginLeft: "10px" }}></i>
        )}
      </button>
    </>
  );
}
