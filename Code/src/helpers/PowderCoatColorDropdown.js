import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";

const PowderCoatColorDropdown = ({ value = "", fn, load }) => {
  const [colorList, setColorList] = useState([]);
  const [show, setShow] = useState(false);

  const getColorList = async () => {
    try {
      setShow(true);
      // Temporarily use a mock API or existing similar API until backend is ready
      // const apiResponse = await callAPI(apiUrls.GetAllPowderCoatColor, {}, "GET");
      
      // Mock data for now - replace with actual API call once backend is implemented
      const mockResponse = {
        data: {
          isSuccess: true,
          data: [
            { id: "1", colorName: "White" },
            { id: "2", colorName: "Black" },
            { id: "3", colorName: "Bronze" },
            { id: "4", colorName: "Almond" }
          ]
        }
      };
      
      setShow(false);
      if (mockResponse?.data?.isSuccess) {
        setColorList(mockResponse?.data?.data);
      } else {
        setColorList([]);
      }
    } catch (error) {
      setShow(false);
      setColorList([]);
    }
  };

  useEffect(() => {
    getColorList();
  }, [load]);

  return (
    <div className="position-relative">
      {show && <SelectBoxLoader />}
      <select
        value={value}
        className="form-select"
        name="powderCoatColorId"
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="">Select Powder Coat Color</option>
        {colorList?.map((item, i) => {
          return (
            <option 
              key={i} 
              value={item?.id} 
            >
              {item?.colorName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default PowderCoatColorDropdown;