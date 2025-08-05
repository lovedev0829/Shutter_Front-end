import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import {SelectBoxLoader } from "./common";

export default function GetAllOptions({
  value = [],
  fn,
  load,
  name = "optionTypeId",
  disabled = false,
  producttypeId = "",
  indexId = 0,
  setOptionName = () => {},
  setAdditionalCosts = () => {},
  isRender = true,
  buildRequirement = false,
  showOptionsPopup = false,
  setOptionMapping = () => {}
}) {
  // Main state
  const [optionList, setoptionList] = useState([]);
  const [allOption, setAllOption] = useState([]);
  const [show, setShow] = useState(false);

  // Local state for tracking changes
  const [localOptionName, setLocalOptionName] = useState({});
  const [localAdditionalCosts, setLocalAdditionalCosts] = useState({});
 const Loginuser = JSON.parse(localStorage.getItem("userData"));
  const fetchOptions = async () => {
    if (!producttypeId) return;

    try {
      setShow(true);
      const query = {
        productId: producttypeId,
        isManageProductOption: !Loginuser?.isTenant,
      };

      const apiResponse = await callAPI(apiUrls.GetAllOption, query, "GET", {});

      if (apiResponse?.data?.isSuccess) {
        let fetchedOptions = apiResponse.data.data.filter((item) => {
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
          return item;
        });

        // Filter by buildRequirement when in popup mode
        if (showOptionsPopup) {
          fetchedOptions = fetchedOptions.filter(
            (item) => item.buildRequirement === buildRequirement
          );
        }

        setoptionList(fetchedOptions);

        const preSelectedOptions = [];
        const selectedOptionDetails = [];
        const optionLabelToIdMapping = {};

        fetchedOptions.forEach((item) => {
          const selectedOptionId = value.find((val) =>
            item.options.some((opt) => opt.optionTypeId === val)
          );

          const finalOption = selectedOptionId
            ? item.options.find((opt) => opt.optionTypeId === selectedOptionId)
            : item.options.find((opt) => opt.isDefault);

          if (finalOption) {
            preSelectedOptions.push({
              optionName: `${item.optionId}-${indexId}`,
              value: finalOption.optionTypeId,
            });

            const optionLabel = `${item.optionName}-${indexId}`;
            selectedOptionDetails.push({
              optionGroupName: item.optionName,
              optionType: finalOption.optionType,
            });

            optionLabelToIdMapping[optionLabel] = finalOption.optionTypeId;
          }
        });

        setAllOption(preSelectedOptions);

        // Set local option names
        const flatSelectedOptions = {};
        selectedOptionDetails.forEach((opt) => {
          const optionLabel = `${opt.optionGroupName}-${indexId}`;
          flatSelectedOptions[optionLabel] = opt.optionType;
        });

        setLocalOptionName(flatSelectedOptions);

        // Update option mapping in parent component
        updateOptionMapping(optionLabelToIdMapping);
      } else {
        resetState();
      }
    } catch (error) {
      resetState();
    } finally {
      setShow(false);
    }
  };

  const updateOptionMapping = (optionLabelToIdMapping, isPartialUpdate = false) => {
    if (typeof setOptionMapping === "function") {
      setOptionMapping((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((item) => item.indexId === indexId);
        
        const newEntry = {
          indexId,
          data: isPartialUpdate && existingIndex !== -1
            ? { ...updated[existingIndex].data, ...optionLabelToIdMapping }
            : optionLabelToIdMapping
        };

        if (existingIndex !== -1) {
          updated[existingIndex] = newEntry;
        } else {
          updated.push(newEntry);
        }

        return updated;
      });
    }
  };

  const resetState = () => {
    setoptionList([]);
    setAllOption([]);
    setLocalOptionName({});
  };

  useEffect(() => {
    if (producttypeId) {
      fetchOptions();
    }
    // eslint-disable-next-line
  }, [producttypeId, load, showOptionsPopup, buildRequirement]);
  // Sync with parent components
  useEffect(() => {
    if (typeof setOptionName === "function") {
      setOptionName((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((item) => item.indexId === indexId);
        const newEntry = { indexId, data: localOptionName };

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
        const existingIndex = updated.findIndex((item) => item.indexId === indexId);
        const newEntry = { indexId, data: localAdditionalCosts };

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
    const labelElement = e.target.closest(".form-check")?.querySelector("label");
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

    // Update option mapping
    updateOptionMapping({ [`${optionGroupName}-${indexId}`]: newVal }, true);
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
        requirePriceAtEstimatePreview: costValue.trim() !== ""
      }
    }));
  };

  const handleDoubleClickOption = (optionId, optionGroupName) => {
    const optionKey = `${optionId}-${indexId}`;
    const nameKey = `${optionGroupName}-${indexId}`;

    // Remove from allOption
    setAllOption((prevOptions) =>
      prevOptions.filter((opt) => opt.optionName !== optionKey)
    );

    // Remove from localOptionName
    setLocalOptionName((prev) => {
      const updated = { ...prev };
      delete updated[nameKey];
      return updated;
    });

    // Remove from option mapping
    if (typeof setOptionMapping === "function") {
      setOptionMapping((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((item) => item.indexId === indexId);

        if (existingIndex !== -1) {
          const updatedData = { ...updated[existingIndex].data };
          delete updatedData[nameKey];
          updated[existingIndex] = { ...updated[existingIndex], data: updatedData };
        }

        return updated;
      });
    }
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
                      onDoubleClick={() =>
                        handleDoubleClickOption(item?.optionId, item?.optionName)
                      }
                      disabled={disabled}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`additionalCost-${option?.optionTypeId}-${indexId}`}
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
