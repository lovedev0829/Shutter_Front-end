import React, { useEffect, useState } from 'react'
export default function Tablist2({Tablist,handleGettab}) {
  const initialActiveTab = localStorage.getItem("activeTab") || Tablist[0].id;
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    handleGettab(activeTab)
    // eslint-disable-next-line
  }, [activeTab]);
  return (
    <>
{Tablist.map((val,i)=>(
  <li className="nav-item" role="presentation" key={i}>
        <button
         className={`nav-link ${activeTab === val.id ? "active" : ""}`}
         id={`pills-${val.id}-tab`}
         data-bs-toggle="pill"
         data-bs-target={val.id}
         type="button"
         role="tab"
         aria-controls={`pills-${val.id}`}
         aria-selected={activeTab === val.id ? "true" : "false"}
         onClick={() => setActiveTab(val.id)} 
        >
          {val.title}
        </button>
      </li>
))}

    </>
  )
}