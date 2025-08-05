import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import {  SelectBoxLoader } from "./common";
export default function Alloption({ value = "", fn, load, name = "optionId", disabled = false, className = null, producttypeId = "" }) {
    const [productList, setproductList] = useState([]);
    const [show, setShow] = useState(false);
     const Loginuser = JSON.parse(localStorage.getItem("userData"));
    const productlist = async () => {
        try {
            setShow(true)
            let query = { ProductTypeId: producttypeId,isManageProductOption:!Loginuser?.isTenant }
            const apiResponse = await callAPI(apiUrls.GetAllOption, query, "GET", {});
            setShow(false)
            if (apiResponse?.data?.isSuccess) {
                setproductList(apiResponse?.data?.data)
            } else {
            }
        } catch (error) {
            setShow(false)
            setproductList([]);
        }
    };

    useEffect(() => {
        if (!producttypeId) {
            setproductList([]);
            return
        }
        productlist()
        // eslint-disable-next-line 
    }, [producttypeId, load]);
    

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
                <option value="">Choose Option </option>
                {productList?.map((item, i) => {
                    return (
                        <option key={i} value={item.optionId} selected={item?.optionId === value ? true : false}>{item?.optionName}</option>

                    );
                })}
            </select>
        </div>
    );
}


