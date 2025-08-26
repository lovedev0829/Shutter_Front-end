import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { CircularProgress, Box} from '@mui/material';

export default function ContactUniqueIdBreakdown({ value = "", fn, name = "contactUniqueId", disabled = false, className = null, ContactId = "" }) {
    const [productList, setproductList] = useState([]);
    const [show, setShow] = useState(false);
    const productlist = async () => {
        try {
            setShow(true)
            let query = { ContactName: ContactId }
            const apiResponse = await callAPI(apiUrls.ContactUniqueIdBreakdown, query, "GET", {});
            setShow(false)
            if (apiResponse?.data?.isSuccess) {
                setproductList(apiResponse?.data?.data)
            } else {
            }
        } catch (error) {
            setShow(false)
            setproductList([]);
        }
    };

    useEffect(() => {
        if (!ContactId) {
            setproductList([]);
            return
        }
        productlist()
        // eslint-disable-next-line 
    }, [ContactId]);
    

    return (
        <div className="position-relative">
              {show && (
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            <div className="form-floating">
                <select 
                    value={value}
                    className={`form-select modern-select ${className || ''}`}
                    name={name}
                    onChange={(e) => {
                        if (fn) fn(e);
                    }}
                    disabled={disabled}
                    id="contactUniqueIdSelect"
                    style={{
                        minHeight: '56px',
                        fontSize: '16px',
                        backgroundColor: '#fff',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        paddingTop: '1.625rem',
                        paddingBottom: '0.625rem',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#0d6efd';
                        e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#e9ecef';
                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    }}
                    onMouseEnter={(e) => {
                        if (!disabled) {
                            e.target.style.borderColor = '#0d6efd';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!e.target.matches(':focus')) {
                            e.target.style.borderColor = '#e9ecef';
                        }
                    }}
                >
                    <option value="">Choose Customer Id</option>
                    {productList?.map((item, i) => (
                        <option key={i} value={item?.contactId}>
                            {item?.contactUniqueId}
                        </option>
                    ))}
                </select>
                <label 
                    htmlFor="contactUniqueIdSelect" 
                    className="form-label"
                    style={{
                        fontSize: '14px',
                        color: '#6c757d',
                        fontWeight: '500',
                    }}
                >
                    Choose Customer Id
                </label>
            </div>
            
            <style jsx>{`
                .modern-select {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e") !important;
                    background-repeat: no-repeat !important;
                    background-position: right 0.75rem center !important;
                    background-size: 16px 12px !important;
                }
                
                .modern-select:hover {
                    transform: translateY(-1px);
                }
                
                .modern-select:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none !important;
                }
                
                .form-floating > .form-select:focus ~ label,
                .form-floating > .form-select:not(:placeholder-shown) ~ label {
                    opacity: 0.85;
                    transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
                }
                
                @media (max-width: 768px) {
                    .modern-select {
                        min-height: 60px !important;
                        font-size: 18px !important;
                    }
                }
            `}</style>
        </div>
    );
}


