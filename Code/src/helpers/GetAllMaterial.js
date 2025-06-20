import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

export default function GetAllMaterial({ value = "", fn, load, className = null, name = "materialId" ,Materials=[],VendorId}) {
  const [MaterialList, setMaterialList] = useState([]);
  const [show, setShow] = useState(false);
  const Materiallist = async () => {
    try {
      setShow(true)
      const apiResponse = await callAPI(apiUrls.GetAllIMaterial, {VendorId:VendorId}, "GET");
      setShow(false)
      if (apiResponse?.data?.isSuccess) {
        setMaterialList(apiResponse?.data?.data)
      } else {
      }
    } catch (error) {
      setShow(false)
      setMaterialList([]);
    }
  };

  useEffect(() => {
    Materiallist();
    // eslint-disable-next-line
  }, [load,VendorId]);

  return (
    <div className="position-relative">
      {show && <SelectBoxLoader />}
      <select value={value}
        className={`form-select ${className}`}
        name={name}
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Material</option>
        {MaterialList?.map((item, i) => {
          return (
            <option key={i} value={item?.materialId} selected={item?.materialId === value ? true : false} disabled={Materials?.some((items,index)=>items?.materialId===item?.materialId)}>{item?.materialName}</option>
          );
        })}
      </select>
    </div>
  );
}


