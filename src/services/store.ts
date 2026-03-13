import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsReducer from './slices/ingredientsSlice';
import authReducer from './slices/authSlice';
import constructorReducer from './slices/constructorSlice';
import ordersReducer from './slices/ordersSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';

const rootReducer = {
  ingredients: ingredientsReducer,
  auth: authReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  feed: feedReducer,
  order: orderReducer // новый редьюсер
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;