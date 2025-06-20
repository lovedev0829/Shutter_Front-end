import moment from "moment";
import React from "react";

export default function DateInputField({name,value,handleChange,action="add"}) {
  return (
    <div className="position-relative calender-input">
      <input
        style={{ color: "white" }}
        type="date"
        className="form-control"
        name={name}
        min={action === "add" ?moment().format("YYYY-MM-DD"):null}
        value={moment(value).format("YYYY-MM-DD") || ""}
        onChange={handleChange}
      />
      <span
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#212529",
          pointerEvents: "none",
        }}
      >
        {value
          ? moment(value).format("MM-DD-YYYY")
          : "mm-dd-yyyy"}
      </span>
      <img src="/image/calendar-alt.svg" alt="" loading="lazy" />
    </div>
  );
}
