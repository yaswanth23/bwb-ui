import { USER_ACTION_TYPES } from "./user.types";

export const USER_INITIAL_STATE = {
  userData: {},
  isUserloggedIn: false,
};

export const userReducer = (state = USER_INITIAL_STATE, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.SET_USER_DATA:
      return {
        ...state,
        userData: payload,
      };
    case USER_ACTION_TYPES.SET_USER_LOGGED_IN:
      return {
        ...state,
        isUserloggedIn: true,
      };
    case USER_ACTION_TYPES.SET_USER_LOGOUT:
      return {
        ...state,
        userData: {},
        isUserloggedIn: false,
      };
    default:
      return state;
  }
};
