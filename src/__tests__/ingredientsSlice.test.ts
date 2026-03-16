import ingredientsReducer, {
  getIngredients
} from '../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 10,
      price: 100,
      image: '',
      image_large: '',
      image_mobile: ''
    }
  ];

  test('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('should handle getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const newState = ingredientsReducer(initialState, action);
    
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('should handle getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const newState = ingredientsReducer(initialState, action);
    
    expect(newState.loading).toBe(false);
    expect(newState.ingredients).toEqual(mockIngredients);
    expect(newState.error).toBeNull();
  });

  test('should handle getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const newState = ingredientsReducer(initialState, action);
    
    expect(newState.loading).toBe(false);
    expect(newState.ingredients).toEqual([]);
    expect(newState.error).toBe('Ошибка загрузки');
  });
});