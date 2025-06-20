import React from "react";
const Detail = ({ title,Data }) => {
  return (
    <div className="col-xxl-4 col-lg-4 col-md-5 col-12">
      <div className="vendordetail">
        <h2>{title}</h2>
        {Data.map((detail, index) => (
          <div key={index} className="vdetaildata d-flex align-items-center justify-content-between">
            <p className="font-14">{detail.label}</p>
            <h2 className="font-14">{detail.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
