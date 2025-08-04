import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
export default function ContactJobBreakdown({ value = "", fn, name = "JobId", disabled = false, className = null, ContactId = "" }) {
    const [productList, setproductList] = useState([]);
    const [show, setShow] = useState(false);
    const productlist = async () => {
        try {
            setShow(true)
            let query = { ContactId: ContactId }
            const apiResponse = await callAPI(apiUrls.ContactJobBreakdown, query, "GET", {});
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
        if (!ContactId) {
            setproductList([]);
            return
        }
        productlist()
        // eslint-disable-next-line 
    }, [ContactId]);
    

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
                <option value="">Choose Job</option>
                {productList?.map((item, i) => {
                    return (
                        <option key={i} value={item?.jobId} selected={item?.jobId === value ? true : false}>{item?.jobName}</option>

                    );
                })}
            </select>
        </div>
    );
}


