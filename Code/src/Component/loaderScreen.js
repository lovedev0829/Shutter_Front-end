import { useSelector } from "react-redux";

export default function LoadScreen(){
  const users = useSelector((state) => state.UserProfile.profile);
  const user = JSON.parse(localStorage.getItem("userData"));
return(
  <div className="loading-screens">
  <div className="loading-logos">
    <img src={users?.logo||user?.logo||"/image/logo.svg"} alt="logo" loading="lazy"/>
  </div>
  <p className="loading-texts">Please wait, we are fetching your data...</p>
</div>
)
}




