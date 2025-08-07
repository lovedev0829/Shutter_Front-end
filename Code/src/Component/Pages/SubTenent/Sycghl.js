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
import {
  Container,
  Paper,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Sync, PersonOutline } from "@mui/icons-material";
export default function Sycghl() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
      <ApiLoder open={loder} />
      <div className="intersight_content">
        <Header title="Sync GHL Users" />
        <div className="body_content">
          <Container 
            maxWidth={false}
            sx={{ 
              px: isMobile ? 2 : 3,
              py: isMobile ? 2 : 3,
              maxWidth: '100%'
            }}
          >
            {/* Header Section */}
            <Box sx={{ mb: isMobile ? 3 : 4 }}>
              <TableTitle title="Manage Sync GHL Users" />
            </Box>

            {/* Main Form Section */}
            <Paper 
              elevation={2}
              sx={{
                borderRadius: isMobile ? '8px' : '12px',
                overflow: 'hidden',
                border: '1px solid #e3f2fd',
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderBottom: '1px solid #e2e8f0',
                  p: isMobile ? 2 : 3,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: isMobile ? 40 : 48,
                      height: isMobile ? 40 : 48,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <PersonOutline sx={{ color: 'white', fontSize: isMobile ? 20 : 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant={isMobile ? "h6" : "h5"} 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1e293b',
                        fontSize: isMobile ? '1.125rem' : '1.25rem',
                        mb: 0.5,
                      }}
                    >
                      GHL Configuration
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: isMobile ? '0.8125rem' : '0.875rem',
                      }}
                    >
                      Configure GHL sync settings for this partner
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ p: isMobile ? 2 : 3 }}>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={isMobile ? 3 : 4}>
                    {/* Radio Group Section */}
                    <Box>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#1e293b',
                          mb: 2,
                          fontSize: isMobile ? '1rem' : '1.125rem',
                        }}
                      >
                        Is the GHL configuration the same for the{" "}
                        <Box 
                          component="span" 
                          sx={{ 
                            color: '#3b82f6', 
                            fontWeight: 700,
                            backgroundColor: '#eff6ff',
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px',
                            fontSize: isMobile ? '0.875rem' : '1rem',
                          }}
                        >
                          {localStorage?.getItem("ghluser")}
                        </Box>
                        ?
                      </Typography>
                      
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={value.isGHLConfigSameasTenant.toString()}
                          onChange={handleRadioChange}
                          sx={{
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? 1 : 2,
                          }}
                        >
                          <FormControlLabel
                            value="true"
                            control={
                              <Radio 
                                sx={{ 
                                  color: '#64748b',
                                  '&.Mui-checked': { color: '#3b82f6' }
                                }} 
                              />
                            }
                            label={
                              <Typography 
                                sx={{ 
                                  fontSize: isMobile ? '0.875rem' : '0.9375rem',
                                  fontWeight: 500,
                                  color: '#374151',
                                }}
                              >
                                Yes
                              </Typography>
                            }
                            sx={{
                              backgroundColor: value.isGHLConfigSameasTenant === true ? '#eff6ff' : 'transparent',
                              borderRadius: '8px',
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: value.isGHLConfigSameasTenant === true ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                            }}
                          />
                          <FormControlLabel
                            value="false"
                            control={
                              <Radio 
                                sx={{ 
                                  color: '#64748b',
                                  '&.Mui-checked': { color: '#3b82f6' }
                                }} 
                              />
                            }
                            label={
                              <Typography 
                                sx={{ 
                                  fontSize: isMobile ? '0.875rem' : '0.9375rem',
                                  fontWeight: 500,
                                  color: '#374151',
                                }}
                              >
                                No
                              </Typography>
                            }
                            sx={{
                              backgroundColor: value.isGHLConfigSameasTenant === false ? '#eff6ff' : 'transparent',
                              borderRadius: '8px',
                              px: 2,
                              py: 1,
                              mx: 0,
                              border: value.isGHLConfigSameasTenant === false ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    {/* GHL Users Dropdown */}
                    {value.isGHLConfigSameasTenant && (
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#374151',
                            mb: 1,
                            fontSize: isMobile ? '0.875rem' : '0.9375rem',
                          }}
                        >
                          GHL Users <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                        </Typography>
                        <GetAllGHLUsers
                          name="ghlUserId"
                          value={value.ghlUserId}
                          fn={handleChange}
                          load={true}
                        />
                        {simpleValidator.current.message(
                          "GHL Users",
                          value?.ghlUserId,
                          `required`
                        ) && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#ef4444', 
                              mt: 0.5,
                              display: 'block',
                              fontSize: isMobile ? '0.75rem' : '0.8125rem',
                            }}
                          >
                            {simpleValidator.current.message(
                              "GHL Users",
                              value?.ghlUserId,
                              `required`
                            )}
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Action Buttons */}
                    <Stack 
                      direction={isMobile ? 'column' : 'row'} 
                      spacing={isMobile ? 2 : 2}
                      justifyContent="flex-end"
                      sx={{ pt: 1 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loder}
                        size={isMobile ? 'large' : 'medium'}
                        sx={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: isMobile ? '0.875rem' : '0.9375rem',
                          padding: isMobile ? '12px 24px' : '10px 20px',
                          minHeight: isMobile ? '48px' : '40px',
                          width: isMobile ? '100%' : 'auto',
                          minWidth: '120px',
                          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                          '&:hover': {
                            backgroundColor: '#2563eb',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                          },
                          '&:disabled': {
                            backgroundColor: '#9ca3af',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        Submit
                      </Button>
                      
                      {ghl && (
                        <Button
                          onClick={handleDelte}
                          variant="contained"
                          startIcon={<Sync />}
                          size={isMobile ? 'large' : 'medium'}
                          sx={{
                            backgroundColor: '#059669',
                            color: 'white',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: isMobile ? '0.875rem' : '0.9375rem',
                            padding: isMobile ? '12px 24px' : '10px 20px',
                            minHeight: isMobile ? '48px' : '40px',
                            width: isMobile ? '100%' : 'auto',
                            minWidth: '140px',
                            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
                            '&:hover': {
                              backgroundColor: '#047857',
                              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
                            },
                          }}
                        >
                          Sync GHL
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </form>
              </Box>
            </Paper>
          </Container>
        </div>
      </div>
    </>
  );
}
