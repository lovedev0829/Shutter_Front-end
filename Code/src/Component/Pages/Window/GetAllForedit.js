import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { HasPermission, SelectBoxLoader } from "../../../helpers/common";

function GetAllForedit({
  values = [],
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
  const [optionList, setOptionList] = useState([]);
  const [allOption, setAllOption] = useState([]);
  const [show, setShow] = useState(false);

  const [localOptionName, setLocalOptionName] = useState({});
  const [localAdditionalCosts, setLocalAdditionalCosts] = useState({});

  const fetchOptions = async () => {
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
        
        setOptionList(fetchedOptions);

        const selectedFromValues = fetchedOptions
          .map((item) => {
            const selected = item.options.find((opt) =>
              values
                .map((v) => v.toLowerCase())
                .includes(opt.optionTypeId?.toLowerCase())
            );

            const defaultOption =
              selected || item.options.find((o) => o.isDefault);

            // ✅ Update localOptionName state initially
            if (defaultOption) {
              setLocalOptionName((prev) => ({
                ...prev,
                [`${item.optionName}-${indexId}`]: defaultOption.optionType,
              }));
            }

            return {
              optionName: `${item.optionId}-${indexId}`,
              value: defaultOption?.optionTypeId || null,
            };
          })
          .filter((opt) => opt.value !== null);

        setAllOption(selectedFromValues);
      } else {
        setOptionList([]);
        setAllOption([]);
        setLocalOptionName({});
      }
    } catch (error) {
      setShow(false);
      setOptionList([]);
      setAllOption([]);
      setLocalOptionName({});
    }
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

  // ✅ Sync with parent component
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

  const handleChangeOption = (
    e,
    optionGroupId,
    optionTypeId,
    optionGroupName,
    labelText
  ) => {
    const updatedOption = {
      optionName: `${optionGroupId}-${indexId}`,
      value: optionTypeId,
    };

    setAllOption((prevOptions) => {
      const existingIndex = prevOptions.findIndex(
        (opt) => opt.optionName === updatedOption.optionName
      );

      if (existingIndex !== -1) {
        const newOptions = [...prevOptions];
        newOptions[existingIndex] = updatedOption;
        return newOptions;
      } else {
        return [...prevOptions, updatedOption];
      }
    });

    // ✅ Update localOptionName with label
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

export default GetAllForedit;
