import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { HasPermission, SelectBoxLoader } from "./common";

export default function GetAllOptions({
  value = [],
  fn,
  load,
  name = "optionTypeId",
  disabled = false,
  className = null,
  producttypeId = "",
  indexId = 0,
  optionName = [],
  setOptionName = () => {},
  additionalCosts = [],
  setAdditionalCosts = () => {},
  isRender = true,
  buildRequirement = false,
  showOptionsPopup = false
}) {
  const [optionList, setoptionList] = useState([]);
  const [allOption, setAllOption] = useState([]);
  const [show, setShow] = useState(false);
  const [localOptionName, setLocalOptionName] = useState({});
  const [localAdditionalCosts, setLocalAdditionalCosts] = useState({});

  const optionlist = async () => {
    try {
      if (!producttypeId) return;
      setShow(true);

      const query = {
        productId: producttypeId,
        isManageProductOption: HasPermission("SubTenantView") ? false : true,
      };

      const apiResponse = await callAPI(apiUrls.GetAllOption, query, "GET", {});
      setShow(false);
      
      if (apiResponse?.data?.isSuccess) {
        let fetchedOptions = apiResponse?.data?.data?.map((item) => {
          const hasDefault = item.options.some((opt) => opt.isDefault === true);

          if (!hasDefault && item.options.length > 0) {
            // Clone options array and set the first one to default
            const updatedInnerOptions = item.options.map((opt, index) => ({
              ...opt,
              isDefault: index === 0 ? true : opt.isDefault,
            }));

            return {
              ...item,
              options: updatedInnerOptions,
            };
          }

          return item; // No change needed if already has a default
        });

        if(showOptionsPopup === true){
          // Filter options based on buildRequirement
          fetchedOptions = fetchedOptions.filter((item) => {
            return item.buildRequirement === buildRequirement;
          });
        }

        setoptionList(fetchedOptions);

        const preSelectedOptions = [];
        const selectedOptionDetails = [];

        fetchedOptions.forEach((item) => {
          const selectedOptionId = value.find((val) =>
            item.options.some((opt) => opt.optionTypeId === val)
          );

          let finalOption;
          if (selectedOptionId) {
            finalOption = item.options.find(
              (opt) => opt.optionTypeId === selectedOptionId
            );
          } else {
            finalOption = item.options.find((opt) => opt.isDefault);
          }

          if (finalOption) {
            preSelectedOptions.push({
              optionName: `${item.optionId}-${indexId}`,
              value: finalOption.optionTypeId,
            });

            selectedOptionDetails.push({
              optionGroupName: item.optionName,
              optionType: finalOption.optionType,
            });
          }
        });

        setAllOption(preSelectedOptions);

        // ✅ Store flat object like { "Option 1-1": "ABCD", "Color-1": "Red", ... }
        const flatSelectedOptions = {};
        selectedOptionDetails.forEach((opt) => {
          flatSelectedOptions[`${opt.optionGroupName}-${indexId}`] =
            opt.optionType;
        });
        setLocalOptionName(flatSelectedOptions);
      } else {
        setoptionList([]);
        setAllOption([]);
        setLocalOptionName({});
      }
    } catch (error) {
      setShow(false);
      setoptionList([]);
      setAllOption([]);
      setLocalOptionName({});
    }
  };

  useEffect(() => {
    if (producttypeId) {
      optionlist();
    }
    // eslint-disable-next-line
  }, [producttypeId, load, showOptionsPopup, buildRequirement]);
  useEffect(() => {
    if (typeof setOptionName === "function") {
      setOptionName((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(
          (item) => item.indexId === indexId
        );

        const newEntry = {
          indexId,
          data: localOptionName,
        };

        if (existingIndex !== -1) {
          updated[existingIndex] = newEntry;
        } else {
          updated.push(newEntry);
        }

        return updated;
      });
    }
    // eslint-disable-next-line
  }, [localOptionName]);

  useEffect(() => {
    if (typeof setAdditionalCosts === "function") {
      setAdditionalCosts((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(
          (item) => item.indexId === indexId
        );

        const newEntry = {
          indexId,
          data: localAdditionalCosts,
        };

        if (existingIndex !== -1) {
          updated[existingIndex] = newEntry;
        } else {
          updated.push(newEntry);
        }

        return updated;
      });
    }
    // eslint-disable-next-line
  }, [localAdditionalCosts]);

  useEffect(() => {
    if (fn) {
      fn({ target: { name, value: allOption.map((obj) => obj.value) } });
    }
    // eslint-disable-next-line
  }, [allOption, name]);

  const handleChangeOption = (e, optionId, optionGroupName) => {
    const newVal = e.target.value;
    const labelElement = e.target
      .closest(".form-check")
      ?.querySelector("label");
    const labelText = labelElement?.innerText || "";
    setAllOption((prevOptions) =>
      prevOptions.map((opt) =>
        opt.optionName === `${optionId}-${indexId}`
          ? { ...opt, value: newVal }
          : opt
      )
    );

    setLocalOptionName((prev) => ({
      ...prev,
      [`${optionGroupName}-${indexId}`]: labelText,
    }));
  };

  const handleAdditionalCostChange = (e, optionTypeId, optionGroupName, optionType) => {
    const costValue = e.target.value;
    const costKey = `${optionTypeId}-${indexId}`;
    
    setLocalAdditionalCosts((prev) => ({
      ...prev,
      [costKey]: {
        optionTypeId,
        optionGroupName,
        optionType,
        additionalCost: costValue,
        requirePriceAtEstimatePreview: costValue.trim() !== "" // Auto-set to true when cost is entered
      }
    }));
  };

  return (
    <div className="position-relative">
      {show && <SelectBoxLoader />}
      {isRender && (
        <div className="exp-modal-inner">
          {optionList?.map((item, i) => (
            <div key={i} className="d-flex gap-4 mb-2">
              <label
                className="form-check-label font-14 exp-inner-label"
                htmlFor={`flexCheck-${item?.optionId}`}
              >
                {item?.optionName}
              </label>
              <div className="d-flex gap-4 flex-wrap flex-column">
                {item?.options.map((option, index) => (
                  <div className="form-check" key={index}>
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`flexCheck-${option?.optionTypeId}-${indexId}`}
                      name={`${item?.optionId}-${indexId}`}
                      value={option?.optionTypeId}
                      checked={allOption.some(
                        (opt) =>
                          opt.optionName === `${item?.optionId}-${indexId}` &&
                          opt.value === option?.optionTypeId
                      )}
                      onChange={(e) =>
                        handleChangeOption(e, item?.optionId, item?.optionName)
                      }
                      disabled={disabled}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`flexCheck-${option?.optionTypeId}-${indexId}`}
                    >
                      {option?.optionType}
                    </label>
                    { !option?.additionalCost && (
                          <input 
                              type="text" 
                              className="form-control" 
                              id={`additionalCost-${option?.optionTypeId}-${indexId}`} 
                              name={`additionalCost-${option?.optionTypeId}-${indexId}`} 
                              placeholder="Enter cost"
                              value={localAdditionalCosts[`${option?.optionTypeId}-${indexId}`]?.additionalCost || ""}
                              onChange={(e) => handleAdditionalCostChange(e, option?.optionTypeId, item?.optionName, option?.optionType)}
                              style={{ height: "30px", width: "100px", marginTop: "5px" }}
                        />)
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
