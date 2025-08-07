import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  alpha,
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function GetAllContact({ value = "", fn, load, className = null }) {
  const theme = useTheme();
  const [countryList, setCountryList] = useState([]);
  const [show, setShow] = useState(false);

  const CountryList = async () => {
    try {
      setShow(true);
      const apiResponse = await callAPI(apiUrls.GetAllContact, {}, "GET", {});
      setShow(false);
      if (apiResponse?.data?.isSuccess) {
        setCountryList(apiResponse?.data?.data);
      } else {
        setCountryList([]);
      }
    } catch (error) {
      setCountryList([]);
      setShow(false);
    }
  };

  useEffect(() => {
    CountryList();
  }, [load]);

  // Find the selected contact object
  const selectedContact = countryList.find(contact => contact.contactId === value) || null;

  const handleChange = (event, newValue) => {
    // Create a synthetic event object to match the original API
    const syntheticEvent = {
      target: {
        name: "contactId",
        value: newValue ? newValue.contactId : ""
      }
    };

    if (fn) fn(syntheticEvent);
  };

  return (
    <Box sx={{ position: 'relative', minWidth: 250 }}>
      <Autocomplete
        value={selectedContact}
        onChange={handleChange}
        options={countryList}
        getOptionLabel={(option) => {
          if (!option) return "";
          return `${option.firstName} ${option.lastName} ${option.suffix ?? ""}`.trim();
        }}
        isOptionEqualToValue={(option, value) => {
          return option.contactId === value?.contactId;
        }}
        filterOptions={(options, { inputValue }) => {
          if (!inputValue) return options;

          const filtered = options.filter((option) => {
            const fullName = `${option.firstName} ${option.lastName} ${option.suffix ?? ""}`.toLowerCase();
            const uniqueId = option.contactUniqueId.toLowerCase();
            const searchTerm = inputValue.toLowerCase();

            return fullName.includes(searchTerm) || uniqueId.includes(searchTerm);
          });

          return filtered;
        }}
        loading={show}
        disabled={show}
        noOptionsText={
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No contacts found
            </Typography>
          </Box>
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search contacts..."
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              ),
              endAdornment: (
                <>
                  {show ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: 'primary.main' }}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease',
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputBase-input': {
                py: 1.25,
                px: 1,
              },
            }}
          />
        )}
        renderOption={(props, option, { selected }) => {
          const fullName = `${option.firstName} ${option.lastName} ${option.suffix ?? ""}`.trim();

          return (
                         <ListItem
               {...props}
               sx={{
                 py: 1.5,
                 px: 2,
                 backgroundColor: 'background.paper',
                 '&:hover': {
                   backgroundColor: '#e8e8e8',
                 },
                 '&.Mui-selected': {
                   backgroundColor: 'action.selected',
                   '&:hover': {
                     backgroundColor: 'action.selected',
                   },
                 },
               }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: selected
                      ? 'primary.main'
                      : 'grey.100',
                    color: selected
                      ? 'primary.contrastText'
                      : 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {option.firstName?.charAt(0)}{option.lastName?.charAt(0)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: selected ? 600 : 500,
                      color: 'text.primary',
                      lineHeight: 1.2,
                    }}
                  >
                    {fullName}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={option.contactUniqueId}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        backgroundColor: selected
                          ? 'primary.light'
                          : 'grey.50',
                        color: selected
                          ? 'primary.main'
                          : 'text.secondary',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                }
              />
            </ListItem>
          );
        }}
                 PaperComponent={({ children, ...props }) => (
           <Box
             {...props}
             sx={{
               borderRadius: 2,
               mt: 1,
               boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
               border: '1px solid',
               borderColor: 'divider',
               maxHeight: 400,
               backgroundColor: '#ffffff',
               '& .MuiAutocomplete-listbox': {
                 py: 1,
                 maxHeight: 350,
                 backgroundColor: '#ffffff',
               },
             }}
           >
             {children}
           </Box>
         )}
        sx={{
          '& .MuiAutocomplete-popupIndicator': {
            transform: 'none',
          },
          '& .MuiAutocomplete-clearIndicator': {
            visibility: 'visible',
          },
        }}
      />
      {show && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            zIndex: 1,
          }}
        >
          <SelectBoxLoader />
        </Box>
      )}
    </Box>
  );
}


