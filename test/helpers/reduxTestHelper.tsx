import { configureStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

/**
 * render a hook with redux store context provider
 *
 * @param hook the hook to be tested
 * @param reducer reducer to create the store which the hook deps on
 * @param options additional options to build the store
 * * _storeKey_: if the reducer is part of the RootState, provide one of the keys.
 * * _state_: the initial state for the store, will replace the reducer's initial value
 * @returns `{ store, hook }`
 * * _store_: the store you might use it to dispatch actions or get states
 * * _hook_: the hook instance allows you to use in test case
 */
export function renderHookWithStore<State extends { [key: string]: any }>(
  hook: Function,
  reducer: Reducer,
  options?: {
    storeKey: string;
    state?: State;
  }
) {
  let reducers: Reducer | ReducersMapObject;
  if (options?.storeKey) {
    reducers = {
      [options?.storeKey]: reducer,
    };
  } else {
    reducers = reducer;
  }

  let preloadedState: State | { [path: string]: State } | undefined;
  if (options?.state) {
    if (options?.storeKey) {
      preloadedState = {
        [options?.storeKey]: options?.state,
      };
    } else {
      preloadedState = options?.state;
    }
  }

  const store = preloadedState
    ? configureStore({ reducer: reducers, preloadedState })
    : configureStore({ reducer: reducers });
  return {
    store,
    hook: renderHook(() => hook(), {
      initialProps: { store },
      wrapper: Provider,
    }),
  };
}
