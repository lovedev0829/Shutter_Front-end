import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import { Link } from "react-router-dom";
import GetAllMaterial from "../../../helpers/GetAllMaterial";
const EditVendorMaterial = ({
    open,
    handleclose,
    LanguageListAPI,
    action,
    object,
    vendorOrderId,
    materials,
    vendorId
}) => {
    const defaultState = {

        vendorOrderItemId:"",
        materialId: "",
        quantity: "",
        unitPrice: "",

    }
    const [value, setValue] = useState(object ? object : defaultState);
    const [loader, setLoader] = useState(false);
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, forceUpdate] = useState();

    const handleChange = (e) => {
        setValue((val) => {
            return { ...val, [e.target.name]: e.target.value };
        });
    };

    const languageAdd = async (e) => {
        e.preventDefault();
        const formValid = simpleValidator.current.allValid();
        if (!formValid) {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        } else {
            try {
                setLoader(true);
                const data={...value,vendorOrderId:vendorOrderId}
                const apiResponse = await callAPI(
                    action === "add" ? apiUrls.updateVendorOrderItem : apiUrls.updateVendorOrderItem,
                    {},
                    "POST",
                    data    
                );
                setLoader(false);
                if (apiResponse?.data?.isSuccess) {
                    SuccessMessage(apiResponse?.data?.message);
                    await LanguageListAPI();
                    handleclose();
                    setValue(defaultState);
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                } else {
                    ErrorMessage(apiResponse?.data?.message);
                }
            } catch (error) {
                setLoader(false);
            }
        }
    };
    useEffect(() => {
        if (action === "edit") {
            setValue(object);
        } else { setValue(defaultState); }
        // eslint-disable-next-line
    }, [open, action]);
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
                                    {action === "add" ? "Add Vendor Order" : "Update Vendor Order Item"}
                                </h1>
                                <i
                                    className="icofont-close btn-close"
                                    onClick={() => {
                                        setValue(defaultState);
                                        handleclose();
                                        simpleValidator.current.hideMessages();
                                        forceUpdate();
                                    }}
                                ></i>
                            </div>
                            <form onSubmit={languageAdd}>
                                <div className="modal-body modale-scroll">
                                    <div className="form-design">
                                        <div className="row">
                                            <div className="col-lg-4 col-md-4">
                                                <div className="form-group">
                                                    <label className="font-14">Material <sup>*</sup></label>
                                                    <GetAllMaterial
                                                        value={value.materialId}
                                                        fn={handleChange}
                                                        load={true}
                                                        className="selectboxdropdown"
                                                        name="materialId"
                                                        Materials={materials}
                                                        VendorId={vendorId}
                                                    />

                                                    <div className="error">
                                                        {simpleValidator.current.message(
                                                            "material",
                                                            value?.materialId,
                                                            `required`
                                                        )}
                                                    </div>
                                                </div>

                                            </div>


                                            <div className="col-lg-4 col-md-4">
                                                <div className="form-group">
                                                    <label className="font-14">Quantity <sup>*</sup></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter quantity"
                                                        name="quantity"
                                                        value={value?.quantity}
                                                        onChange={handleChange}
                                                    />
                                                    <div className="error">
                                                        {simpleValidator.current.message(
                                                            "quantity",
                                                            value?.quantity,
                                                            "required|integer"
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4">
                                                <div className="form-group">
                                                    <label className="font-14">Unit Price <sup>*</sup></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter unit Price"
                                                        name="unitPrice"
                                                        value={value?.unitPrice}
                                                        onChange={handleChange}
                                                    />
                                                    <div className="error">
                                                        {simpleValidator.current.message(
                                                            "unitPrice",
                                                            value?.unitPrice,
                                                            "required|numeric"
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <div className="form-style form-group d-flex align-items-center justify-content-end">
                                        <Link
                                            to={"#"}
                                            className="cancel text-decoration-underline"
                                            onClick={() => {
                                                setValue(defaultState);
                                                handleclose();
                                                simpleValidator.current.hideMessages();
                                                forceUpdate();
                                            }}
                                        >
                                            Cancel
                                        </Link>
                                        <SubmitButton
                                            type="submit"
                                            className="btn blue-btn"
                                            name={action === "add" ? "Submit" : "Update"}
                                            disabled={loader}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default EditVendorMaterial;
