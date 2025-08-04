import React, { useEffect } from "react";
import { useState } from "react";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import {
  ApiLoder,
  ErrorMessage,
  HasPermission,
  SuccessMessage,
} from "../../../helpers/common";

import SubmitButton from "../../Form/SubmitButton";
import { Link } from "react-router-dom";
import { Dialog } from "@mui/material";

export default function Stages({ open, handleclose, action }) {
  const [loder, setLoader] = useState(false);
  const [Stages, setStages] = useState([]);
  const [value, setValue] = useState({});
  const [JobStatus, setJobStatus] = useState([]);

  const startLoading = () => setLoader((prev) => prev + 1);
  const stopLoading = () => setLoader((prev) => Math.max(0, prev - 1));

  const handleInputChange = (index, val) => {
    const newTopics = [...value.mappings];
    newTopics[index].stageId = val;
    setValue((val) => ({ ...val, mappings: newTopics }));
  };

  const StatusList = async (data) => {
    try {
      startLoading();
      const apiResponse = await callAPI(apiUrls.GetAllJobStatus, {}, "GET");
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        data !== "load" &&
          setValue({
            mappings: apiResponse.data.data.map((lang) => ({
              statusId: lang.jobStatusId,
              stageId: null,
            })),
          });
        setJobStatus(apiResponse.data.data);
      } else {
      }
    } catch (error) {
      stopLoading();
    }
  };

  const StagesList = async () => {
    try {
      startLoading();
      const apiResponse = await callAPI(apiUrls.GetAllStages, {}, "GET");
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        setStages(apiResponse?.data?.data);
      } else {
      }
    } catch (error) {
      stopLoading();
      setStages([]);
    }
  };

  const GetallStagesMapping = async () => {
    try {
      startLoading();
      const apiResponse = await callAPI(apiUrls.GetallStagesMapping, {}, "GET");
      stopLoading();
      if (apiResponse?.data?.isSuccess) {
        if (apiResponse?.data?.data?.length > 0) {
          setValue({
            mappings: apiResponse.data.data.map((lang) => ({
              statusId: lang.statusId,
              stageId: lang.stageId,
            })),
          });
          StatusList("load");
        } else {
          StatusList();
        }
      } else {
        StatusList();
      }
    } catch (error) {
      StatusList();
      stopLoading();
      setStages([]);
    }
  };

  useEffect(() => {
    StagesList();
    // StatusList();
    GetallStagesMapping();
    // eslint-disable-next-line
  }, [action]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    try {
      const sanitizedValue = {
        ...value,
        mappings: value?.mappings?.map((material) => ({
          ...material,
          statusId: material.statusId,
          stageId: !material.stageId ? null : material.stageId,
        })),
      };
      const response = await callAPI(
        apiUrls.GHLStagesMapping,
        {},
        "POST",
        sanitizedValue
      );
      stopLoading();
      if (response.data.isSuccess) {
        GetallStagesMapping();
        SuccessMessage(response.data?.message);
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (error) {
      stopLoading();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "800px",
            },
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          className="modal fade show"
          id="contactModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-modal="true"
          role="dialog"
          style={{ display: "block", backgroundColor: "#00000080" }}
        >
          <div className="modal-dialog modal-dialog-centered filter_modal">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="exampleModalLabel">
                  GHL Stages Mapping
                </h1>

                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    handleclose();
                  }}
                ></i>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body modale-scroll">
                {loder > 0 && <ApiLoder/>}
                  <div className="form-design">
                    <div className="row">
                      {value.mappings !== undefined &&
                        value.mappings.length > 0 &&
                        value?.mappings?.map((val, i) => {
                          return (
                            <React.Fragment key={i}>
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  {i === 0 && (
                                    <label className="font-14 d-flex align-items-center justify-content-between">
                                      <span>Job Status</span>
                                    </label>
                                  )}

                                  <div className="position-relative">
                                    <select
                                      className="form-select"
                                      aria-label="Default select example"
                                      name="statusId"
                                      value={val?.statusId}
                                      disabled
                                    >
                                      {JobStatus?.map((vals, idx) => {
                                        return (
                                          <option
                                            value={vals.jobStatusId}
                                            key={idx}
                                            selected={
                                              vals.jobStatusId === val?.statusId
                                                ? true
                                                : false
                                            }
                                          >
                                            {vals.jobStatusName}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  {i === 0 && (
                                    <label className="font-14 d-flex align-items-center justify-content-between">
                                      <span>GHL Stage</span>
                                    </label>
                                  )}
                                  <div className="position-relative">
                                    <select
                                      className="form-select"
                                      aria-label="Default select example"
                                      name="stageId"
                                      value={val?.stageId}
                                      onChange={(e) =>
                                        handleInputChange(i, e.target.value)
                                      }
                                    >
                                      <option value="">No Action</option>
                                      {Stages?.map((vals, idx) => {
                                        const isDisabled =
                                          value?.mappings?.some(
                                            (material) =>
                                              material?.stageId ===
                                              vals?.ghlStageId
                                          );

                                        return (
                                          <option
                                            value={vals.ghlStageId}
                                            key={idx}
                                            disabled={
                                              isDisabled &&
                                              vals.ghlStageId !== val?.stageId
                                            }
                                            selected={
                                              vals.ghlStageId === val?.stageId
                                                ? true
                                                : false
                                            }
                                          >
                                            {vals.ghlStageName}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <Link
                      to={"#"}
                      className="cancel text-decoration-underline"
                      onClick={() => {
                        handleclose();
                      }}
                    >
                      Cancel
                    </Link>

                    {HasPermission("GHLEdit") && (
                      <SubmitButton
                        type="submit"
                        className="btn blue-btn me-3"
                        name={"Submit"}
                        disabled={loder > 0 ? true : false}
                      />
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
