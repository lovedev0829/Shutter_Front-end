import { useEffect, useState } from "react";
import { callAPI } from "../utils/apiUtils";
import { apiUrls } from "../utils/apiUrls";
import { SelectBoxLoader } from "./common";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

export default function GetAllCustomer({
    value = [],
    fn,
    load,
    name = "customerId",
    disabled = false,
    className = null,
}) {
    const [CustomerList, setCustomerList] = useState([]);
    const [show, setShow] = useState(false);

    const Customerlist = async () => {
        try {
            setShow(true);
            const apiResponse = await callAPI(apiUrls.GetAllContact, {}, "GET", {});
            setShow(false);
            if (apiResponse?.data?.isSuccess) {
                const customers = apiResponse?.data?.data.map((customer) => ({
                    label: customer.firstName + " " + customer.lastName +  (customer?.suffix ?? "") +  " ( " + customer.contactUniqueId + " ) ",
                    value: customer.contactId,
                }));
                setCustomerList(customers);
            } else {
                setCustomerList([]);
            }
        } catch (error) {
            setShow(false);
            setCustomerList([]);
        }
    };

    useEffect(() => {
        Customerlist();
    }, [load]);

    const handleChange = (selectedOptions) => {
        const options = selectedOptions.map((item) => item.value)

        fn({ target: { name, value: options } });
    };

    return (
        <>
            {show && <SelectBoxLoader />}
            <div className="customer-multiselector">
            <ReactMultiSelectCheckboxes
                options={CustomerList}
                onChange={handleChange}
                isDisabled={disabled}
                className={className}
                placeholderButtonLabel="Choose Customers"
            />
            </div>
          
        </>
    );
}
