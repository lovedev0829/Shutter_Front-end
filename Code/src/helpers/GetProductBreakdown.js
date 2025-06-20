import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
export default function GetProductBreakdown({ value = "", fn, name = "windowProdcutId", disabled = false, className = null, EstimationId = "" }) {
    const [productList, setproductList] = useState([]);
    const [show, setShow] = useState(false);
    const productlist = async () => {
        try {
            setShow(true)
            let query = { EstimationId: EstimationId }
            const apiResponse = await callAPI(apiUrls.GetProductBreakdown, query, "GET", {});
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
        if (!EstimationId) {
            setproductList([]);
            return
        }
        productlist()
        // eslint-disable-next-line 
    }, [EstimationId]);
    

    return (
        <div className="position-relative">
            {show && <SelectBoxLoader />}
            <select value={value}
                className={`form-select ${className}`}
                style={{minWidth:"215px"}}
                name={name}
                onChange={(e) => {
                    if (fn) fn(e);
                }}
                disabled={disabled}
            >
                <option value="">Choose Product</option>
                {productList?.map((item, i) => {
                    return (
                        <option key={i} value={item?.windowProductIds} selected={item?.windowProductIds === value ? true : false}>{item?.productName}</option>

                    );
                })}
            </select>
        </div>
    );
}


