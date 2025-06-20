import { Actiontypes } from "./ActionType";

  export const Profile = (data) => {
    return {
        type: Actiontypes.PROFILE,
         payload: data,
    };
  };  

  export const Window = (data) => {
    return {
        type: Actiontypes.WINDOWS,
         payload: data,
    };
  };  

 
  

 
  
  
  
  
  
  