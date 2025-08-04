import { useEffect, useState } from "react";
import Header from "../../../Layout/header";
import DasboardPart from "../../Form/DasboardPart";
import TableTitle from "../../Form/TableTitle";
import { ApiLoder } from "../../../helpers/common";
import { apiUrls } from "../../../utils/apiUrls";
import { callAPI } from "../../../utils/apiUtils";
import { ErrorMessage } from "../../../helpers/common";
import Calendardashboard from "./Calendardashboard";
import { Link } from "react-router-dom";

export default function Index() {
  const [loder, setLoader] = useState(false);
  const [data, setData] = useState([]);

  const DashBoard = async () => {
    try {
      setLoader(true);
      const response = await callAPI(apiUrls.DashBoard, {}, "GET", {});
      setLoader(false);
      if (response?.data?.isSuccess) {
        setData(response?.data?.data)
      } else {
        ErrorMessage(response?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };
  useEffect(() => {
    DashBoard();
  }, []);
  const user = JSON.parse(localStorage.getItem("userData"));


const Apiload = ()=>{
  DashBoard();
}

  return (
    <>
    
      {loder && <ApiLoder />}
      <div className="intersight_content">
        <Header title="Dashboard" />
        <div className="body_content">
          <div className="opportunities mb-30">
            <h1 className="dasboardh">
              Welcome To{" "}
              <span className="dasboard_title">
                {user?.companyName
                  ? user?.companyName
                  : user?.firstName + user?.lastName}{" "}
                !
              </span>
            </h1>
            {user?.code !=="admin" &&
            <div className="row g-3">
              <DasboardPart
                data={data}
              />
              
            </div>
}
          </div>
          {user?.code !=="admin" &&
          <div className="awarded-jobs task_table">
            <div className="d-flex align-items-center justify-content-between mb-30">
              <TableTitle title="Recent Jobs" />
              <Link to={"/job"} className="color-blue" style={{textDecoration:"underline"}}>View All Jobs</Link>
            </div>
           
            <Calendardashboard Apiload={Apiload} />
          </div>
}
        </div>
       
      </div>
    </>
  );
}
