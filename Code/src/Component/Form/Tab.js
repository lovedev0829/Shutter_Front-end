import React, { useEffect, useState } from "react";
export default function Tab({ Tablist, handleTabchnage }) {
  const initialActiveTab = localStorage.getItem("activeTab2") || Tablist[0]?.id;
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  useEffect(() => {
    localStorage.setItem("activeTab2", activeTab);
    handleTabchnage(activeTab);
    // eslint-disable-next-line
  }, [activeTab]);
  return (
    <>
      {Tablist?.map((val, i) => (
        <li className="nav-item" role="presentation" key={i}>
          <button
            className={`nav-link ${activeTab === val?.id ? "active" : ""}`}
            id={`pills-${val?.id}-tab`}
            data-bs-toggle="pill"
            data-bs-target={val?.id}
            type="button"
            role="tab"
            aria-controls={`pills-${val?.id}`}
            aria-selected={activeTab === val?.id ? "true" : "false"}
            onClick={() => setActiveTab(val?.id)}
          >
            <span>{val?.svg}</span>
            {val?.title}
          </button>
        </li>
      ))}
    </>
  );
}
