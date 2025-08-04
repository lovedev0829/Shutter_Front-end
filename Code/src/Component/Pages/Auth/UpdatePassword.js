import React, { useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { useNavigate } from "react-router-dom";
import {
  CustomMessages,
  ErrorMessage,
  SuccessMessage,
} from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { removeAuth } from "../../../helpers/auth";
import Header from "../../../Layout/header";
// Material UI imports
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Backdrop,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const user = JSON.parse(localStorage.getItem("userData"));

  const [value, setValue] = useState({
    passWord: "",
    oldPassWord: "",
    confirmPassWord: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ messages: CustomMessages })
  );
  const [, forceUpdate] = useState();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target?.value;
    const name = e.target?.name;
    setValue((val) => {
      return { ...val, [name]: value };
    });
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
          apiUrls.ResetPassword,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (response.data.isSuccess) {
          SuccessMessage(response.data?.message);
          handleLogout();
        } else {
          ErrorMessage(response.data.message);
        }
      } catch (error) {
        setLoader(false);
      }
    }
  };

  function handleLogout() {
    navigate(`/${user?.code}`);
    removeAuth();
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header title="Change Password" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <LockIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Change Password
                </Typography>
              </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Please enter your current password and choose a new secure password.
              </Typography>

              <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        placeholder="Enter Current Password"
                        type={currentPassword ? "text" : "password"}
                        name="oldPassWord"
                        value={value?.oldPassWord || ''}
                        onChange={handleChange}
                        required
                        size="small"
                        error={!!simpleValidator.current.message(
                          "oldPassword",
                          value?.oldPassWord,
                          "required"
                        )}
                        helperText={simpleValidator.current.message(
                          "oldPassword",
                          value?.oldPassWord,
                          "required"
                        )}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setCurrentPassword(!currentPassword)}
                                edge="end"
                                size="small"
                              >
                                {currentPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="New Password"
                        placeholder="Enter New Password"
                        type={newPassword ? "text" : "password"}
                        name="passWord"
                        value={value?.passWord || ''}
                        onChange={handleChange}
                        required
                        size="small"
                        error={!!simpleValidator.current.message(
                          "newPassword",
                          value?.passWord,
                          "required"
                        )}
                        helperText={simpleValidator.current.message(
                          "newPassword",
                          value?.passWord,
                          "required"
                        )}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setNewPassword(!newPassword)}
                                edge="end"
                                size="small"
                              >
                                {newPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        placeholder="Enter Confirm Password"
                        type={confirmPassword ? "text" : "password"}
                        name="confirmPassWord"
                        value={value?.confirmPassWord || ''}
                        onChange={handleChange}
                        required
                        size="small"
                        error={!!simpleValidator.current.message(
                          "confirm password",
                          value?.confirmPassWord,
                          `required|in:${value?.passWord}`
                        )}
                        helperText={
                          simpleValidator.current.message(
                            "confirm password",
                            value?.confirmPassWord,
                            `required|in:${value?.passWord}`
                          ) ? "Passwords do not match" : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setConfirmPassword(!confirmPassword)}
                                edge="end"
                                size="small"
                              >
                                {confirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                          variant="text"
                          onClick={() => navigate("/dashboard")}
                          startIcon={<ArrowBackIcon />}
                          sx={{ 
                            textTransform: 'none',
                            color: 'text.secondary',
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loader}
                          startIcon={loader && <CircularProgress size={16} color="inherit" />}
                          sx={{ 
                            textTransform: 'none',
                            minWidth: 120,
                            '&:disabled': {
                              opacity: 0.7
                            }
                          }}
                        >
                          {loader ? 'Updating...' : 'Update Password'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default UpdatePassword;
