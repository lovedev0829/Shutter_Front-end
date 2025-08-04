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

import { Link } from "react-router-dom";
// Material UI imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Backdrop,
  CircularProgress
} from "@mui/material";
import {
  Close as CloseIcon
} from "@mui/icons-material";

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
        maxWidth="md"
        fullWidth
        onClose={handleclose}
        aria-labelledby="stages-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="stages-dialog-title">
          <Typography variant="h6" component="div">
            GHL Stages Mapping
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleclose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
              open={loder > 0}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={2}>
              {value.mappings !== undefined &&
                value.mappings.length > 0 &&
                value?.mappings?.map((val, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Grid item xs={12} md={6}>
                        {i === 0 && (
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Job Status
                          </Typography>
                        )}
                        <FormControl fullWidth size="small" disabled>
                          <InputLabel>Job Status</InputLabel>
                          <Select
                            value={val?.statusId || ''}
                            label="Job Status"
                            name="statusId"
                          >
                            {JobStatus?.map((vals, idx) => (
                              <MenuItem
                                value={vals.jobStatusId}
                                key={idx}
                              >
                                {vals.jobStatusName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        {i === 0 && (
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            GHL Stage
                          </Typography>
                        )}
                        <FormControl fullWidth size="small">
                          <InputLabel>GHL Stage</InputLabel>
                          <Select
                            value={val?.stageId || ''}
                            label="GHL Stage"
                            name="stageId"
                            onChange={(e) =>
                              handleInputChange(i, e.target.value)
                            }
                          >
                            <MenuItem value="">
                              <em>No Action</em>
                            </MenuItem>
                            {Stages?.map((vals, idx) => {
                              const isDisabled =
                                value?.mappings?.some(
                                  (material) =>
                                    material?.stageId ===
                                    vals?.ghlStageId
                                );

                              return (
                                <MenuItem
                                  value={vals.ghlStageId}
                                  key={idx}
                                  disabled={
                                    isDisabled &&
                                    vals.ghlStageId !== val?.stageId
                                  }
                                >
                                  {vals.ghlStageName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </React.Fragment>
                  );
                })}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleclose}
              variant="text"
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            {HasPermission("GHLEdit") && (
              <Button
                type="submit"
                variant="contained"
                disabled={loder > 0}
                sx={{ textTransform: 'none' }}
              >
                Submit
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
