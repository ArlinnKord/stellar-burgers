import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} from '../services/slices/constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
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
  };

  const mockMain: TIngredient = {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 20,
    price: 200,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  test('should return initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('should handle addIngredient for bun', () => {
    const action = addIngredient(mockBun);
    const newState = constructorReducer(initialState, action);
    
    expect(newState.bun).not.toBeNull();
    expect(newState.bun?.name).toBe('Булка');
    expect(newState.bun?.type).toBe('bun');
    expect(newState.bun?.id).toBeDefined(); // проверяем, что добавился id
    expect(newState.ingredients).toHaveLength(0);
  });

  test('should handle addIngredient for main', () => {
    const action = addIngredient(mockMain);
    const newState = constructorReducer(initialState, action);
    
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0].name).toBe('Начинка');
    expect(newState.ingredients[0].id).toBeDefined();
  });

  test('should handle removeIngredient', () => {
    // Сначала добавляем ингредиент
    const addAction = addIngredient(mockMain);
    let newState = constructorReducer(initialState, addAction);
    expect(newState.ingredients).toHaveLength(1);
    
    // Удаляем его
    const removeAction = removeIngredient(0);
    newState = constructorReducer(newState, removeAction);
    
    expect(newState.ingredients).toHaveLength(0);
  });

  test('should handle moveIngredient', () => {
    // Добавляем два ингредиента
    const mockMain2 = { ...mockMain, _id: '3', name: 'Другая начинка' };
    
    let newState = constructorReducer(initialState, addIngredient(mockMain));
    newState = constructorReducer(newState, addIngredient(mockMain2));
    
    expect(newState.ingredients[0].name).toBe('Начинка');
    expect(newState.ingredients[1].name).toBe('Другая начинка');
    
    // Меняем местами
    const moveAction = moveIngredient({ from: 0, to: 1 });
    newState = constructorReducer(newState, moveAction);
    
    expect(newState.ingredients[0].name).toBe('Другая начинка');
    expect(newState.ingredients[1].name).toBe('Начинка');
  });

  test('should handle resetConstructor', () => {
    // Добавляем булку и начинку
    let newState = constructorReducer(initialState, addIngredient(mockBun));
    newState = constructorReducer(newState, addIngredient(mockMain));
    
    expect(newState.bun).not.toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    
    // Сбрасываем
    newState = constructorReducer(newState, resetConstructor());
    
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
  });
});