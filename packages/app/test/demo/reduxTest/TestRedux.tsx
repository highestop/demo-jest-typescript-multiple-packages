import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export interface CounterState {
  count: number;
}

export const initialState: CounterState = {
  count: 0,
};

export const enum CounterActionType {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
}

export interface CounterAction {
  type: CounterActionType;
}

export function incrementActionCreator() {
  return { type: CounterActionType.INCREMENT };
}
export function dencrementActionCreator() {
  return { type: CounterActionType.DECREMENT };
}

export function reducer(
  state = initialState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case CounterActionType.INCREMENT:
      return {
        count: state.count + 1,
      };
    case CounterActionType.DECREMENT:
      return {
        count: state.count - 1,
      };
    default:
      return state;
  }
}

export function useCounter() {
  const dispatch = useDispatch();

  const increment = () => dispatch(incrementActionCreator());
  const decrement = () => dispatch(dencrementActionCreator());

  const count = useSelector<CounterState, number>(state => state.count);

  return { increment, decrement, count };
}

export function TestRedux() {
  const { increment, decrement, count } = useCounter();
  return (
    <>
      <h1 data-testid="counter">{count}</h1>
      <button data-testid="button-up" onClick={increment}>
        Up
      </button>
      <button data-testid="button-down" onClick={decrement}>
        Down
      </button>
    </>
  );
}
