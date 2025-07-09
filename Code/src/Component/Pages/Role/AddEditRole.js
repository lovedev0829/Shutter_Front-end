import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import SimpleReactValidator from "simple-react-validator";
import { callAPI } from "../../../utils/apiUtils";
import { apiUrls } from "../../../utils/apiUrls";
import { ErrorMessage, SuccessMessage } from "../../../helpers/common";
import SubmitButton from "../../Form/SubmitButton";
import InputField from "../../Form/InputField";
import { Link } from "react-router-dom";

const AddEditRole = ({
  open,
  handleclose,
 LanguageListAPI, // Refesh Api
  action, // Add or Edit
  object, // selectedData data
  permission,
}) => {
  const [value, setValue] = useState({ roleName: "", rolePermissionId: [] });
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const RoleAddUpdate = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      try {
        setLoader(true);

        const apiResponse = await callAPI(
          action === "add" ? apiUrls.RoleCreate : apiUrls.RoleUpdate,
          {},
          "POST",
          value
        );
        setLoader(false);
        if (apiResponse?.data?.isSuccess) {
          SuccessMessage(apiResponse?.data?.message);
          await LanguageListAPI();
          handleclose();
          setValue({ roleName: "", rolePermissionId: [] });
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
      setValue({
        roleName: object?.roleName,
        rolePermissionId: object?.rolePermissionId
          ? object?.rolePermissionId
          : [],
        roleId: object.roleId,
      });
    } else setValue({ roleName: "", rolePermissionId: [] });
    // eslint-disable-next-line
  }, [open, action]);

  const handlePermissionChange = (permissionId) => {
    setValue((prevState) => {
      const { rolePermissionId } = prevState;
      if (rolePermissionId.includes(permissionId)) {
        return {
          ...prevState,
          rolePermissionId: rolePermissionId.filter(
            (id) => id !== permissionId
          ),
        };
      } else {
        return {
          ...prevState,
          rolePermissionId: [...rolePermissionId, permissionId],
        };
      }
    });
  };

  const handleSelectAllChange = (isChecked, permissions) => {
    setValue((prevState) => {
      const { rolePermissionId } = prevState;
      const permissionIds = permissions.map((perm) => perm.permissionId);

      if (isChecked) {
        return {
          ...prevState,
          rolePermissionId: [
            ...new Set([...rolePermissionId, ...permissionIds]),
          ],
        };
      } else {
        return {
          ...prevState,
          rolePermissionId: rolePermissionId.filter(
            (id) => !permissionIds.includes(id)
          ),
        };
      }
    });
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
                  {action === "add" ? "Add Role" : "Update Role"}
                </h1>
                <i
                  className="icofont-close btn-close"
                  onClick={() => {
                    setValue({ roleName: "", rolePermissionId: [] });
                    handleclose();
                    simpleValidator.current.hideMessages();
                    forceUpdate();
                  }}
                ></i>
              </div>
              <form onSubmit={RoleAddUpdate}>
                <div className="modal-body modale-scroll">
                  <div className="form-design">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <InputField
                            labelName={"Role Name"}
                            placeholderName={"Enter Role name"}
                            type={"text"}
                            handleChange={handleChange}
                            id={"roleName"}
                            name={"roleName"}
                            value={value.roleName}
                            required={true}
                          />
                          <div className="error">
                            {simpleValidator.current.message(
                              "roleName",
                              value?.roleName,
                              `required|min:3`
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="task_table mb-30">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col" className="w-70">
                              Title
                            </th>
                            <th scope="col" className="text-center">
                              Select All
                            </th>
                            <th scope="col" className="text-center">
                              Add
                            </th>
                            <th scope="col" className="text-center">
                              Edit
                            </th>
                            <th scope="col" className="text-center">
                              View
                            </th>
                            <th scope="col" className="text-center">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {permission.map((module, index) => (
                            <tr key={index}>
                              <td className="w-70">
                                {module.moduleDisplayName}
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  style={{ border: "1px solid #8f8b8b" }}
                                  className="form-check-input"
                                  checked={[
                                    "Add",
                                    "Edit",
                                    "View",
                                    "Delete",
                                  ].every((actions) => {
                                    const permission = module.permissions.find(
                                      (perm) =>
                                        perm.modulePermissionDisplay.includes(
                                          actions
                                        )
                                    );
                                    return permission
                                      ? value.rolePermissionId.includes(
                                          permission.permissionId
                                        )
                                      : true;
                                  })}
                                  onChange={(e) =>
                                    handleSelectAllChange(
                                      e.target.checked,
                                      module.permissions.filter((perm) =>
                                        ["Add", "Edit", "View", "Delete"].some(
                                          (actions) =>
                                            perm.modulePermissionDisplay.includes(
                                              actions
                                            )
                                        )
                                      )
                                    )
                                  }
                                />
                              </td>
                              {["Add", "Edit", "View", "Delete"].map(
                                (actions) => {
                                  const permission = module.permissions.find(
                                    (perm) =>
                                      perm.modulePermissionDisplay.includes(
                                        actions
                                      )
                                  );
                                  if (
                                    module.moduleName === "Setting" &&
                                    (actions === "Add" ||
                                      actions === "View" ||
                                      actions === "Delete")
                                  ) {
                                    return (
                                      <td key={action} className="text-center">
                                        {/* Empty cell to maintain table structure */}
                                      </td>
                                    );
                                  }

                                  if (
                                    module.moduleName ===
                                      "EmailConfiguration" &&
                                    (actions === "Add" || actions === "Delete")
                                  ) {
                                    return (
                                      <td key={action} className="text-center">
                                        {/* Empty cell to maintain table structure */}
                                      </td>
                                    );
                                  }
                                  if (
                                    module.moduleName ===
                                      "EstimationBreakdown" &&
                                    (actions === "Add" ||
                                      actions === "Edit" ||
                                      actions === "Delete")
                                  ) {
                                    return (
                                      <td key={action} className="text-center">
                                        {/* Empty cell to maintain table structure */}
                                      </td>
                                    );
                                  }
                                  if (
                                    module.moduleName === "ArchiveCustomer" &&
                                    (actions === "Add" ||
                                      actions === "Edit" ||
                                      actions === "Delete")
                                  ) {
                                    return (
                                      <td key={action} className="text-center">
                                        {/* Empty cell to maintain table structure */}
                                      </td>
                                    );
                                  }
                                  if (
                                    module.moduleName === "PartnerContact" &&
                                    (actions === "Add" ||
                                      actions === "Edit" ||
                                      actions === "Delete")
                                  ) {
                                    return (
                                      <td key={action} className="text-center">
                                        {/* Empty cell to maintain table structure */}
                                      </td>
                                    );
                                  }
                                  if (
                                    module.moduleName === "GHL" &&
                                    (actions === "Add" || actions === "Delete")
                                  ) {
                                    return (
                                      <td key={action} className="text-center">
                                        {/* Empty cell to maintain table structure */}
                                      </td>
                                    );
                                  }
                                  if (
                                    module.moduleName === "Stripe" &&
                                    (actions === "Add" || actions === "Delete")
                                  ) {
                                    return (
                                      <td key={action} className="text-center">
                                        {/* Empty cell to maintain table structure */}
                                      </td>
                                    );
                                  }
                                  if (
                                    module.moduleName === "ManageProduct" &&
                                    (actions === "Add" || actions === "Delete")
                                  ) {
                                    return (
                                      <td key={action} className="text-center">
                                        {/* Empty cell to maintain table structure */}
                                      </td>
                                    );
                                  }
                                  return (
                                    <td key={actions} className="text-center">
                                      <input
                                        type="checkbox"
                                        style={{ border: "1px solid #8f8b8b" }}
                                        className="form-check-input"
                                        checked={value.rolePermissionId.includes(
                                          permission?.permissionId
                                        )}
                                        onChange={() =>
                                          handlePermissionChange(
                                            permission.permissionId
                                          )
                                        }
                                      />
                                    </td>
                                  );
                                }
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="form-style form-group d-flex align-items-center justify-content-end">
                    <Link
                      to={"#"}
                      className="cancel text-decoration-underline"
                      onClick={() => {
                        setValue({ roleName: "", rolePermissionId: [] });
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

export default AddEditRole;
