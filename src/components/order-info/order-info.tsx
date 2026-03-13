import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { getOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  
  const { orders } = useSelector((state: RootState) => state.feed);
  const { orders: profileOrders } = useSelector((state: RootState) => state.orders);
  const { order: singleOrder, loading: orderLoading } = useSelector((state: RootState) => state.order);
  const ingredients = useSelector((state: RootState) => state.ingredients.ingredients);

  const orderData = useMemo(() => {
    const allOrders = [...orders, ...profileOrders];
    return allOrders.find((item) => item.number === Number(number));
  }, [orders, profileOrders, number]);

  useEffect(() => {
    if (!orderData && number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, orderData, number]);

  const currentOrder = orderData || singleOrder;

  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (!orderInfo || orderLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

export default OrderInfo;