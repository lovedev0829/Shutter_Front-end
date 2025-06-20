import React from "react";
import { useNavigate } from "react-router-dom";

export default function DasboardPart({ data }) {
  const navigate = useNavigate();

  function redirect (url){
    localStorage.setItem("activeTab2", "#pills-overview");
    navigate(url);
  }

  return (
    <>
      {data?.map((val, i) => (
        <div className="col-lg-3 col-6" key={i} style={{cursor:"pointer"}} onClick={(()=>redirect(val?.url))}>
          <div className="opportunities-box">
            <div className="opportunities-icon">
              <img src={val?.image} alt=" " loading="lazy"/>
            </div>
            <p className="mb-0 d-flex align-items-center gap-2">{val?.label}</p>
            <h4>{val?.count}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
