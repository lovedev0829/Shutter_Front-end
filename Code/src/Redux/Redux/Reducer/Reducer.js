import { Actiontypes } from "../Action/ActionType";
const intialState = {
  profile: {},
  window:[]
};

export const UserProfile = (state = intialState, { type, payload }) => {
  switch (type) {
    case Actiontypes.PROFILE:
      return { ...state, profile: payload };
    default:
      return state;
  }
};

export const Windowsadd = (state = intialState, { type, payload }) => {
  switch (type) {
    case Actiontypes.WINDOWS:
      return { ...state, window: payload };
    default:
      return state;
  }
};






