import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetAllRegionDropdown({ value = "", fn, load, name = "region", disabled = false, className = null }) {
    const [regionList, setregionList] = useState([]);
    const [show, setShow] = useState(false);
    const regionlist = async () => {
        try {
            setShow(true)
            const apiResponse = await callAPI(apiUrls.GetAllRegion, {}, "GET");
            setShow(false)
            if (apiResponse?.data?.isSuccess) {
                setregionList(apiResponse?.data?.data)
            } else {
            }
        } catch (error) {
            setShow(false)
            setregionList([]);
        }
    };

    useEffect(() => {
        regionlist();
    }, [load]);
    return (
        <div className="position-relative">
            {show && <SelectBoxLoader />}
            <select value={value}
                className={`form-select ${className}`}
                name={name}
                onChange={(e) => {
                    if (fn) fn(e);
                }}
                disabled={disabled}
            >
                <option value="">Select Region</option>
                {regionList?.map((item, i) => {
                    return (
                        
                            <option key={i} value={item?.regionId} selected={item?.regionId === value ? true : false}>{item?.regionName}</option>
                       
                    );
                })}
            </select>
        </div>
    )
}
