import React from "react";
import { Button } from "@mui/material";

export default function MaterialButton(props) {
  return (
    <Button
      type={props.type || "button"}
      onClick={props.handleClick}
      disabled={props.disabled}
      variant={props.variant || "contained"} // "contained", "outlined", "text"
      color={props.color || "primary"} // "primary", "secondary", "error", "warning", "info", "success"
      size={props.size || "medium"} // "small", "medium", "large"
      className={props.className} // You can still use CSS classes
      sx={{
        // Material UI's sx prop for styling - no styled-components needed
        padding: props.padding || "8px 16px",
        margin: props.margin || "8px 0",
        textTransform: props.textTransform || "none",
        fontWeight: props.fontWeight || 500,
        borderRadius: props.borderRadius || "4px",
        "&:hover": {
          backgroundColor: props.hoverColor || undefined,
        },
        "&:disabled": {
          opacity: 0.6,
        },
        // You can add any CSS properties here
        ...props.sx // Allow additional sx props to be passed
      }}
    >
      {props.children || props.text}
    </Button>
  );
} 