
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SubmitButton, SuccessMessage} from "../../../helpers/common";
import { Profile } from "../../../Redux/Redux/Action/Action";
import { removeAuth } from '../../../helpers/auth';

export default function Logout({ open, handleClose}) {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  // const code = JSON.parse(localStorage.getItem('code'));
  const handleLogout = async () => {
    
        handleClose();
        dispatch(Profile({}))
        navigate(`/login`)
        SuccessMessage('Logout Sucessfully !!');
        removeAuth();
    // try {
    //   setLoader(true);
    //   const apiResponse = await callAPI(apiUrls.logout, {}, "GET");
    //   if (apiResponse.data.status) {
    //     SuccessMessage(apiResponse.data.message);
    //     setLoader(false);
    //     removeAuth();
    //     handleClose();
    //     dispatch(Profile({}))
    //     navigate('/')
    //   } else {
    //     ErrorMessage(apiResponse.data.message);
    //     setLoader(false);
    //   }
    // } catch (error) {
    //   setLoader(false);

    // }



  }

  
  return (
    <>

      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={'xs'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
     
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-body logout-popup text-center">
        <span className="mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={48}
            height={48}
            viewBox="0 0 48 48"
            fill="none"
          >
            
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.592 4.4881C25.306 3.6521 28 6.8441 28 10.0001V38.0001C28 41.1561 25.306 44.3481 21.592 43.5121C12.668 41.5041 6 33.5321 6 24.0001C6 14.4681 12.668 6.4961 21.592 4.4881ZM32.586 16.5861C32.9611 16.2112 33.4697 16.0005 34 16.0005C34.5303 16.0005 35.0389 16.2112 35.414 16.5861L41.414 22.5861C41.7889 22.9612 41.9996 23.4698 41.9996 24.0001C41.9996 24.5304 41.7889 25.039 41.414 25.4141L35.414 31.4141C35.0368 31.7784 34.5316 31.98 34.0072 31.9754C33.4828 31.9709 32.9812 31.7606 32.6104 31.3897C32.2395 31.0189 32.0292 30.5173 32.0247 29.9929C32.0201 29.4685 32.2217 28.9633 32.586 28.5861L35.172 26.0001H18C17.4696 26.0001 16.9609 25.7894 16.5858 25.4143C16.2107 25.0392 16 24.5305 16 24.0001C16 23.4697 16.2107 22.961 16.5858 22.5859C16.9609 22.2108 17.4696 22.0001 18 22.0001H35.172L32.586 19.4141C32.2111 19.039 32.0004 18.5304 32.0004 18.0001C32.0004 17.4698 32.2111 16.9612 32.586 16.5861Z"
              fill="white"
            />
          </svg>
        </span>
        <h3>Logout</h3>
        <p>Are your sure you want to logout?</p>
        <div className="save_btn">
          <button
            type="button"
            className="btn border-btn me-2"
            onClick={handleClose}
          >
            No
          </button>
         
          <SubmitButton
                  text={"Yes"}
                  onClick={() => {
                    handleLogout();
                  }}
                  disabled={false}
                />
        </div>
      </div>
    </div>
  </div>


      


      </Dialog>
    </>
  )
}
