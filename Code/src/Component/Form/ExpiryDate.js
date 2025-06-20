import moment from 'moment'
import React from 'react'

function ExpiryDate({ name, startDate, expiryDate, handlechange,action="add" }) {
    return (
        <div className="position-relative calender-input">
            <input
                style={{ color: "white" }}
                type="date"
                className="form-control"
                placeholder="Enter date"
                name={name}
                value={
                    moment(expiryDate).format("YYYY-MM-DD") ||
                    ""
                }
                onChange={handlechange}
                min={action === "add" ?
                    moment(
                        startDate
                    ).format("YYYY-MM-DD") || "":null
                }
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
                {expiryDate ? moment(expiryDate).format(
                    "MM-DD-YYYY"
                ) : "mm-dd-yyyy"}
            </span>
            <img src="/image/calendar-alt.svg" alt="" loading="lazy"/>
        </div>
    )
}

export default ExpiryDate