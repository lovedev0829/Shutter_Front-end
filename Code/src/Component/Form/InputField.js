import React from "react";

export default function InputField(props) {
  return (
    <>
      <label className="font-14" htmlFor={props.id} style={{display:props.displayLabel}}>
      {props.labelName} {props.required &&<sup>*</sup>}
      </label>
      <input
        type={props.type}
        value={props.value }
        onChange={props.handleChange}
        className="form-control"
        id={props.id}
        name={props.name}
        placeholder={props.placeholderName}
        disabled={props.disabled?true:false}
      />
    </>
  );
}
