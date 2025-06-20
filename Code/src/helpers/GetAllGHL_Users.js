import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
export default function GetAllGHLUsers({
  value = "",
  fn,
  load,
  name = "",
  className = null,
}) {
  const [productList, setproductList] = useState([]);
  const [show, setShow] = useState(false);
  const productlist = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllGHL_Users, {}, "GET", {});
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setproductList(apiResponse?.data?.data);
      } else {
      }
    } catch (error) {
      setShow(false);
      setproductList([]);
    }
  };

  useEffect(() => {
    productlist();
    // eslint-disable-next-line
  }, [load]);

  return (
    <div className="position-relative">
      {show && <SelectBoxLoader />}
      <select
        value={value}
        className={`form-select ${className}`}
        name={name}
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Choose GHL Users</option>
        {productList?.map((item, i) => {
          return (
            <option
              key={i}
              value={item.ghlUserId}
              selected={item?.ghlUserId === value ? true : false}
            >
              {item?.ghlUserName}
            </option>
          );
        })}
      </select>
    </div>
  );
}
