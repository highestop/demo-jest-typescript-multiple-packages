import type { Middleware } from 'redux';
import configureStore from 'redux-mock-store';

// <!-- DO NOT RECOMMEND -->

// use redux mock store to test action dispatching
// but mockStore only provides getAction, clearActions method, meaning you can not assert state change

const middlewares: Middleware[] = [];
const mockStore = configureStore(middlewares);

const addTodo = () => ({ type: 'ADD_TODO' });

describe('redux', () => {
  it('should dispatch action', () => {
    // arrange: initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);

    // act: dispatch the action
    store.dispatch(addTodo());

    // assert: test if your store dispatched the expected actions
    const actions = store.getActions();
    const expectedPayload = { type: 'ADD_TODO' };
    expect(actions).toEqual([expectedPayload]);
  });
});
