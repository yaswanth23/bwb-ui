import { createSelector } from "@reduxjs/toolkit";

const selectUserReducer = (state) => state.user;

export const selectUserData = createSelector(
  [selectUserReducer],
  (user) => user.userData
);

export const selectIsUserLoggedIn = createSelector(
  [selectUserReducer],
  (user) => user.isUserloggedIn
);
