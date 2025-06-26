import React, { useEffect, useState } from "react";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";

const AddEditPowderCoatColor = ({
  open,
  handleClose,
  action,
  PowderCoatColorListAPI,
  selectedData,
}) => {
  const [formData, setFormData] = useState({
    colorName: "",
    description: "",
    cost: "",
  });
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (action === "edit" && selectedData) {
      setFormData({
        colorName: selectedData.colorName || "",
        description: selectedData.description || "",
        cost: selectedData.cost || "",
      });
    } else {
      setFormData({
        colorName: "",
        description: "",
        cost: "",
      });
    }
    setErrors({});
  }, [action, selectedData, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.colorName.trim()) {
      newErrors.colorName = "Color name is required";
    }

    if (formData.cost && isNaN(parseFloat(formData.cost))) {
      newErrors.cost = "Cost must be a valid number";
    }

    if (formData.cost && parseFloat(formData.cost) < 0) {
      newErrors.cost = "Cost must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const powderCoatColorAdd = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const payload = {
        colorName: formData.colorName.trim(),
        description: formData.description.trim(),
        cost: formData.cost ? parseFloat(formData.cost) : null,
      };

      if (action === "edit") {
        payload.id = selectedData.id;
      }

      const response = await callAPI(
        action === "add" ? apiUrls.PowderCoatColorCreate : apiUrls.PowderCoatColorUpdate,
        {},
        "POST",
        payload
      );

      if (response?.data?.isSuccess) {
        SuccessMessage(response.data.message || `Powder coat color ${action === "add" ? "created" : "updated"} successfully`);
        handleClose();
        await PowderCoatColorListAPI();
      } else {
        ErrorMessage(response?.data?.message || `Failed to ${action} powder coat color`);
      }
    } catch (error) {
      console.error("Error:", error);
      ErrorMessage(`Error ${action === "add" ? "creating" : "updating"} powder coat color`);
    } finally {
      setLoader(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa fa-paint-brush me-2"></i>
              {action === "add" ? "Add" : "Edit"} Powder Coat Color
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={loader}
            ></button>
          </div>
          
          <form onSubmit={powderCoatColorAdd}>
            <div className="modal-body">
              <div className="row">
                {/* Color Name Field */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="fa fa-tag me-1"></i>
                    Color Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.colorName ? 'is-invalid' : ''}`}
                    name="colorName"
                    value={formData.colorName}
                    onChange={handleInputChange}
                    placeholder="Enter color name"
                    maxLength={100}
                    disabled={loader}
                  />
                  {errors.colorName && (
                    <div className="invalid-feedback">{errors.colorName}</div>
                  )}
                </div>

                {/* Cost Field */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <i className="fa fa-dollar-sign me-1"></i>
                    Cost
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${errors.cost ? 'is-invalid' : ''}`}
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      disabled={loader}
                    />
                    {errors.cost && (
                      <div className="invalid-feedback">{errors.cost}</div>
                    )}
                  </div>
                </div>

                {/* Description Field */}
                <div className="col-12 mb-3">
                  <label className="form-label">
                    <i className="fa fa-file-text-o me-1"></i>
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter color description (optional)"
                    rows="3"
                    maxLength={200}
                    disabled={loader}
                  />
                  <div className="form-text">
                    <small>Optional description for the powder coat color</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loader}
              >
                <i className="fa fa-times me-1"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loader}
              >
                {loader && <i className="fa fa-spinner fa-spin me-1"></i>}
                <i className={`fa ${loader ? '' : action === 'add' ? 'fa-plus' : 'fa-save'} me-1`}></i>
                {action === "add" ? "Add Color" : "Update Color"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditPowderCoatColor; 