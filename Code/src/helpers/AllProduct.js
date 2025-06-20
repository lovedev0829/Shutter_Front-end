import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
export default function AllProduct({ value = "", fn, load, name = "productId", disabled = false, className = null, producttypeId = "" }) {
    const [productList, setproductList] = useState([]);
    const [show, setShow] = useState(false);
    const productlist = async () => {
        try {
            setShow(true)
            let query = { ProductTypeId: producttypeId }
            const apiResponse = await callAPI(apiUrls.GetAllProduct, query, "GET", {});
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
                <option value="">Choose Product </option>
                {productList?.map((item, i) => {
                    return (
                        <option key={i} value={`${item.productId}|${item.productName}`} selected={item?.productId === value ? true : false}>{item?.productName}</option>

                    );
                })}
            </select>
        </div>
    );
}


