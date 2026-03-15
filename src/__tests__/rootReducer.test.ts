import { combineReducers } from '@reduxjs/toolkit';
import store from '../services/store';

describe('rootReducer', () => {
  test('should return the correct initial state', () => {
    // Получаем состояние стора
    const state = store.getState();
    
    // Проверяем, что все редьюсеры инициализированы
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('order');
  });

  test('should handle unknown action without changing state', () => {
    const initialState = store.getState();
    
    // @ts-ignore - отправляем неизвестный экшен
    const newState = store.dispatch({ type: 'UNKNOWN_ACTION' });
    
    expect(store.getState()).toEqual(initialState);
  });
});