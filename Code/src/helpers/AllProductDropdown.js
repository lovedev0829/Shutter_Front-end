import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import Select from "react-select";

export default function AllProductDropdown({
  value = "",
  fn,
  load,
  name = "productId",
  disabled = false,
  className = null,
  producttypeId = "",
}) {
  const [productList, setproductList] = useState([]);
  const [show, setShow] = useState(false);
  const productlist = async () => {
    try {
      setShow(true);
      let query = { ProductTypeId: producttypeId };
      const apiResponse = await callAPI(
        apiUrls.GetAllProduct,
        query,
        "GET",
        {}
      );
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
    if (!producttypeId) {
      setproductList([]);
      return;
    }
    productlist();
    // eslint-disable-next-line
  }, [producttypeId, load]);

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      position: "absolute", // key change
      zIndex: 9999, // ensure it's above other elements
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const options = productList?.map((item) => ({
    value: item.productId,
    label: item.productName,
  }));

  const handleChange = (selectedOption) => {
    if (fn) {
      fn({
        target: {
          name: name,
          value: selectedOption?.value || "",
        },
      });
    }
  };

  return (
    <div className="position-relative">
      {show && <SelectBoxLoader />}
      {/* <select value={value}
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
                        <option key={i} value={item?.productId} selected={item?.productId === value ? true : false}>{item?.productName}</option>

                    );
                })}
            </select> */}

      <Select
        name={name}
        value={options.find((option) => option.value === value) || null}
        onChange={handleChange}
        options={options}
        classNamePrefix="react-select"
        placeholder="Select Product"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={customStyles}
      />
    </div>
  );
}
