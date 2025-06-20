import { useEffect, useRef, useState } from "react";
import Header from "../../../Layout/header";
import TableTitle from "../../Form/TableTitle";
import GetAllGHLUsers from "../../../helpers/GetAllGHL_Users";
import { useParams } from "react-router-dom";
import SubmitButton from "../../Form/SubmitButton";
import {
  ApiLoder,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import SimpleReactValidator from "simple-react-validator";
export default function Sycghl() {
  const param = useParams();
  const [value, setValue] = useState({
    ghlUserId: "",
    isGHLConfigSameasTenant: true,
    partnerId: param.id,
  });

  const [loder, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [ghl, setGhl] = useState(false);

  const handleRadioChange = (e) => {
    const isAvailable = e.target.value === "true";

    const newValue = {
      ...value,
      isGHLConfigSameasTenant: isAvailable,
    };

    if (!isAvailable) {
      simpleValidator.current.purgeFields("ghlUserId");
      newValue.ghlUserId = "";
    }

    setValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.UpdateGHlConfigforPartner,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data?.message);
          TenantlistAPI();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  const TenantlistAPI = async () => {
    setLoader(true);
    try {
      const apiResponse = await callAPI(
        apiUrls.GetGhlConfigforPartner,
        { Tenantid: param.id },
        "POST",
        {}
      );
      setLoader(false);
      if (apiResponse?.data?.isSuccess) {
        let datas = apiResponse?.data?.data;
        if (!datas?.isGHLConfigSameasTenant) {
          simpleValidator.current.purgeFields("ghlUserId");
        } else {
          setGhl(true);
        }
        setValue({
          ghlUserId: datas?.ghlUserId,
          isGHLConfigSameasTenant: datas?.isGHLConfigSameasTenant,
          partnerId: param.id,
        });
      } else {
        setValue({
          ghlUserId: "",
          isGHLConfigSameasTenant: true,
          partnerId: param.id,
        });
        setGhl(false);
      }
    } catch (error) {
      setGhl(false);
      setLoader(false);
    }
  };
  useEffect(() => {
    if (param.id) {
      TenantlistAPI();
    }
    // eslint-disable-next-line
  }, [param.id]);

  const handleChange = (e) => {
    setValue((val) => {
      let newValue = e.target.value;
      return {
        ...val,
        [e.target.name]: newValue,
      };
    });
  };

  const handleDelte = async () => {
    const isConfirmed = window.confirm(`Are you sure you want to  Sync GHL ?`);
    if (isConfirmed) {
      setLoader(true);
      try {
        const response = await callAPI(
          apiUrls.SyncContactandJobforPartner,
          { Tenantid: param.id },
          "POST",
          {}
        );
        setLoader(false);

        if (response.data.isSuccess) {
          SuccessMessage(response.data?.message);
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };
  return (
    <>
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Sync GHL Users" />
        <div className="body_content">
          <div className="awarded-jobs task_table">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Manage Sync GHL Users" />
            </div>

            <div
              className="form-design"
              style={{ background: "#f5f5f5", padding: "10px" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label className="font-14">
                        Is the GHL configuration the same for the{" "}
                        <strong>{localStorage?.getItem("ghluser")}</strong>?
                      </label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            value="true"
                            checked={value.isGHLConfigSameasTenant === true}
                            onChange={handleRadioChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            value="false"
                            checked={value.isGHLConfigSameasTenant === false}
                            onChange={handleRadioChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {value.isGHLConfigSameasTenant && (
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label className="font-14">
                          GHL Users <sup>*</sup>
                        </label>
                        <GetAllGHLUsers
                          name="ghlUserId"
                          value={value.ghlUserId}
                          fn={handleChange}
                          load={true}
                        />
                        <div className="error">
                          {simpleValidator.current.message(
                            "GHL Users",
                            value?.ghlUserId,
                            `required`
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <SubmitButton
                      type="submit"
                      className="btn blue-btn me-3"
                      name={"Submit"}
                      disabled={loder}
                    />
                    {ghl && (
                      <button
                        type="button"
                        className="btn btn-success me-3"
                        onClick={() => handleDelte()}
                      >
                        Sync GHL
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
