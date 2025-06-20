import React from "react";

export default function InputField2(props) {
  return (
    <>
      <label htmlFor={props.id} className="form-label form-label-custom">
        {props.labelName}
      </label>

      <input
        type={props.type}
        onChange={props.handleChange}
        value={props.value || ""}
        placeholder={props.placeholder}
        id={props.id}
        name={props.name}
        className="form-control form-control-custom"
        
      />
    </>
  );
}