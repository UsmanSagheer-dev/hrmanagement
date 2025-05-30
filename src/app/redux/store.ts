import { configureStore } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "react-redux";
import employeeFormReducer from "./slices/employeeFormSlice";
import userProfileReducer from './slices/userProfileSlice';
const store = configureStore({
  reducer: {
    employeeForm: employeeFormReducer,
     userProfile: userProfileReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
