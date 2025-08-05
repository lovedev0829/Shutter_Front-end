import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import {  SelectBoxLoader } from "../../../helpers/common";

function GetAllForedit({
  values = [],
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
  showOptionsPopup = false
}) {
  // Main state
  const [optionList, setOptionList] = useState([]);
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

        setOptionList(fetchedOptions);

        // Set up selected options with defaults
        const selectedOptions = fetchedOptions
          .map((item) => {
            const selected = item.options.find((opt) =>
              values.some((v) => v.toLowerCase() === opt.optionTypeId?.toLowerCase())
            );

            const defaultOption = selected || item.options.find((o) => o.isDefault);

            if (defaultOption) {
              // Update local option name
              setLocalOptionName((prev) => ({
                ...prev,
                [`${item.optionName}-${indexId}`]: defaultOption.optionType,
              }));

              return {
                optionName: `${item.optionId}-${indexId}`,
                value: defaultOption.optionTypeId,
              };
            }
            return null;
          })
          .filter(Boolean);

        setAllOption(selectedOptions);
      } else {
        resetState();
      }
    } catch (error) {
      resetState();
    } finally {
      setShow(false);
    }
  };

  const resetState = () => {
    setOptionList([]);
    setAllOption([]);
    setLocalOptionName({});
  };

  useEffect(() => {
    if (producttypeId) {
      fetchOptions();
      setLocalOptionName({});
    }
    // eslint-disable-next-line
  }, [producttypeId, load, showOptionsPopup, buildRequirement]);

  useEffect(() => {
    if (allOption.length > 0 && fn) {
      fn({ target: { name, value: allOption.map((obj) => obj.value) } });
    }
    // eslint-disable-next-line
  }, [allOption]);

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

  const handleChangeOption = (e, optionGroupId, optionTypeId, optionGroupName, labelText) => {
    const updatedOption = {
      optionName: `${optionGroupId}-${indexId}`,
      value: optionTypeId,
    };

    setAllOption((prevOptions) => {
      const existingIndex = prevOptions.findIndex(
        (opt) => opt.optionName === updatedOption.optionName
      );

      return existingIndex !== -1
        ? prevOptions.map((opt, i) => (i === existingIndex ? updatedOption : opt))
        : [...prevOptions, updatedOption];
    });

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
        requirePriceAtEstimatePreview: costValue.trim() !== ""
      }
    }));
  };

  return (
    <div className="position-relative">
      {show && <SelectBoxLoader />}
      {isRender && (
        <div className="exp-modal-inner">
          {optionList.map((item, i) => (
            <div key={i} className="d-flex gap-4 mb-2">
              <label
                className="form-check-label font-14 exp-inner-label"
                htmlFor={`flexCheck-${item?.optionId}`}
              >
                {item?.optionName}
              </label>
              <div className="d-flex gap-4 flex-wrap flex-column">
                {item?.options.map((option, index) => (
                  <div key={index}>
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
                        handleChangeOption(
                          e,
                          item?.optionId,
                          option?.optionTypeId,
                          item?.optionName,
                          option?.optionType
                        )
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

export default GetAllForedit;
