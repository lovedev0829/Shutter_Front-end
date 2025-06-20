import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
export default function ContactEstimatioBreakdown({ value = "", fn, name = "EstimationId", disabled = false, className = null, JobId = "" }) {
    const [productList, setproductList] = useState([]);
    const [show, setShow] = useState(false);
    const productlist = async () => {
        try {
            setShow(true)
            let query = { JobId: JobId }
            const apiResponse = await callAPI(apiUrls.ContactEstimatioBreakdown, query, "GET", {});
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
        if (!JobId) {
            setproductList([]);
            return
        }
        productlist()
        // eslint-disable-next-line 
    }, [JobId]);
    

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
                <option value="">Choose Estimate</option>
                {productList?.map((item, i) => {
                    return (
                        <option key={i} value={item?.estimateId} selected={item?.estimateId === value ? true : false}>{item?.estimateName}</option>

                    );
                })}
            </select>
        </div>
    );
}


