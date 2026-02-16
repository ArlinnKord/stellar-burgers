import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { orderBurger, closeOrderModal } from '../../services/slices/ordersSlice';
import { resetConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  console.log('bun:', bun);
  console.log('ingredients:', ingredients);
  const { orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.orders
  );

  const constructorItems = {
  bun: bun,
  ingredients: ingredients
};

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(orderBurger(ingredientsIds));
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
    dispatch(resetConstructor());
    navigate('/');
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};