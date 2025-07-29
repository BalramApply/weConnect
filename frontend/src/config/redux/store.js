import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer"

/**
 * STEPS for state Managment
 * submit Action
 * Handle action in it's reducer
 * Register Here -> Reducer
 */

export const store = configureStore({
    reducer: {
        auth: authReducer,
        postReducer: postReducer
    }
})
