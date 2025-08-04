import React from "react";
import { TextField, FormLabel } from "@mui/material";

export default function MaterialInputField(props) {
  return (
    <>
      {props.labelName && (
        <FormLabel 
          className="font-14" 
          htmlFor={props.id}
          style={{display: props.displayLabel}}
        >
          {props.labelName} {props.required && <sup>*</sup>}
        </FormLabel>
      )}
      <TextField
        type={props.type}
        value={props.value}
        onChange={props.handleChange}
        className="material-input-field" // Custom CSS class
        id={props.id}
        name={props.name}
        placeholder={props.placeholderName}
        disabled={props.disabled ? true : false}
        variant="outlined" // or "filled" or "standard"
        size="small" // or "medium"
        fullWidth
        margin="normal"
      />
    </>
  );
} 