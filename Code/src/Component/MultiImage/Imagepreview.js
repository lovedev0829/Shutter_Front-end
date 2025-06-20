import React from "react";
import { Dialog } from "@mui/material";
import { Link } from "react-router-dom";
function Imagepreview({ imagesData, imageopen, handlecloseImage }) {
    return (
        <Dialog
            open={imageopen}
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
                style={{ display: "block", }}
            >
                <div className="modal-dialog modal-dialog-centered filter_modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="exampleModalLabel">
                                {imagesData?.label}  (W: {imagesData?.width}”, H: {imagesData?.height}”, A: {imagesData?.archHeight}”)
                            </h1>
                            <i
                                className="icofont-close btn-close"
                                onClick={handlecloseImage}
                            ></i>
                        </div>
                        <div className="multiImagepreview">
                            {
                                imagesData?.photo && imagesData?.photo.length > 0 ? (
                                    imagesData.photo.map((item, index) => (
                                        <div key={index} className="imagesMultiple">
                                           <Link to={item.trim()} target="_blank" > <img src={item} height={200} width={200} alt="Uploaded" loading="lazy"/></Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="imagesMultiple" >
                                        <img src="/image/no-image.jpg" height={200} width={200} alt="" loading="lazy"/>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default Imagepreview;
