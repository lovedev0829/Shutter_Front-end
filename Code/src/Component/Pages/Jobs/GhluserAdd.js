import React, { useEffect } from "react";
import { useState } from "react";
import { HasPermission } from "../../../helpers/common";

// Material UI imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Checkbox,
  Stack,
  Grid,
  alpha,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export default function GhluserAdd({ open, handleclose, ghluesrlist = [],OpportunitiesCreate }) {
  const [Ghlusers, setGhlusers] = useState([]);

  const [jobState, setJobState] = useState({
    opportunityId: null,
    jobId: null,
  });

  const theme = useTheme();
  useEffect(() => {
    setGhlusers(ghluesrlist);
    // eslint-disable-next-line
  }, [ghluesrlist, open]);

  const handleCheckboxChange = (id,jobid) => {
    setGhlusers((prev) =>
      prev.map(
        (item) =>
          item.id === id
            ? { ...item, ischecked: !item.ischecked } // Toggle clicked checkbox
            : { ...item, ischecked: false } // Uncheck all others
      )
    );
    const isNowChecked = !Ghlusers.find((item) => item.id === id)?.ischecked;

    setJobState((prev) => ({
      ...prev,
      opportunityId: isNowChecked ? id : null, 
      jobId: jobid ? jobid : null, // set ID if checked, null if unchecked
    }));
  };

  const handleSubmit = async (click) => {
    handleclose();
    OpportunitiesCreate(jobState,click);
    setGhlusers(ghluesrlist);
     setJobState({
    opportunityId: null,
    jobId: null,
  });
  };
  console.log(jobState)

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
            Select Opportunities
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleclose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form">
          <DialogContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="opportunities table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        Opportunities Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        Pipeline Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        Stage Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>Job Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>Select</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Ghlusers?.map((val) => (
                    <TableRow key={val.id}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 200 }}>
                          {val?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 200 }}>
                          {val?.pipelineName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 200 }}>
                          {val?.pipelineStageName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 200 }}>{val?.jobName?val?.jobName:"----"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={val.ischecked || false}
                          onChange={() => handleCheckboxChange(val.id,val.jobId?val.jobId:null)}
                          inputProps={{ "aria-label": val.name }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.info.main, 0.2),
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "info.main",
                    mb: 1,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  Notes:
                </Typography>
                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    • Create (create new) → create a new Opportunity, store its
                    Opportunitie `id`.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    • Update (use existing) → link Job to the existing
                    Opportunity.
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleclose}
              variant="text"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            {HasPermission("GHLEdit") && (
              <Button
                type="button"
                variant="contained"
                disabled={jobState.opportunityId?false:true}
                sx={{ textTransform: "none" }}
                onClick={() => handleSubmit(false)}
              >
                Update
              </Button>
            )}
            {HasPermission("GHLEdit") && (
              <Button
                type="button"
                variant="contained"
                disabled={jobState.opportunityId?true:false}
                sx={{ textTransform: "none" }}
                onClick={() => handleSubmit(true)}
              >
                Create
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
