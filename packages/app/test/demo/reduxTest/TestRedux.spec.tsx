import React from 'react'
import { createStore, Store } from 'redux'
import { Provider } from 'react-redux'
import { render, cleanup as cleanUpComponent, fireEvent } from '@testing-library/react'
import { renderHook, act, cleanup as cleanUpHook } from '@testing-library/react-hooks'
import {
    TestRedux,
    initialState,
    reducer,
    CounterState,
    incrementActionCreator,
    dencrementActionCreator,
    useCounter,
    CounterAction
} from './TestRedux'

// init a redux store with REAL and FULL reducers, with initial state by default
// REAL and FULL are necessary, sometimes single reducer works just fine
// but you can't garentee other reduce won't answer to the same action
const initStore = (state = initialState) => {
    return createStore(reducer, state)
}

// provide a renderer for each component being tested
const renderComponentInProvider = (state: CounterState = initialState) => {
    const store = initStore(state)
    return {
        ...render(
            <Provider store={store}>
                <TestRedux />
            </Provider>
        ),
        store
    }
}

// <!-- DO NOT RECOMMEND -->

// test components using redux
// arrange: render component wrapped with store providers
// act: do nothing (to test initial state) or fire events like click
// assert: get element by test id and assert their content
describe('TestReduxInComponent', () => {
    afterEach(cleanUpComponent)

    it('checks initial state is equal to 0', () => {
        const { getByTestId } = renderComponentInProvider()
        expect(getByTestId('counter')).toHaveTextContent('0')
    })

    it('increments the counter through redux', () => {
        const { getByTestId } = renderComponentInProvider({ count: 5 })
        fireEvent.click(getByTestId('button-up'))
        expect(getByTestId('counter')).toHaveTextContent('6')
    })

    it('decrements the counter through redux', () => {
        const { getByTestId } = renderComponentInProvider({ count: 100 })
        fireEvent.click(getByTestId('button-down'))
        expect(getByTestId('counter')).toHaveTextContent('99')
    })
})

// provide a renderer for each hook being tested
const renderHooksInProvider = (state: CounterState = initialState) => {
    const store = initStore(state)
    return renderHook(() => useCounter(), {
        initialProps: { store },
        wrapper: Provider
    })
}

// <!-- RECOMMEND -->
// seperating logic from view into hooks are better practice
// put them closer to the redux (action creators, reducers, even selectors)

// test hook using redux (but not in component)
// arrange: init a store, render the hook wrapped with store provider, return hook result
// act: call functions in hook
// assert: assert hook state
describe('TestReduxStateInHook', () => {
    afterEach(cleanUpHook)

    it('checks initial state is equal to 0', () => {
        const { result } = renderHooksInProvider()
        expect(result.current.count).toBe(0)
    })

    it('increments the counter through redux', () => {
        const { result } = renderHooksInProvider({ count: 5 })
        act(() => {
            result.current.increment() // must reture void here
        })
        expect(result.current.count).toBe(6)
    })

    it('decrements the counter through redux', () => {
        const { result } = renderHooksInProvider({ count: 100 })
        act(() => {
            result.current.decrement() // must reture void here
        })
        expect(result.current.count).toBe(99)
    })
})

// <!-- NECESSARY -->
// pure functions are basic utils, they are easist and top priority to be tested

// test redux store only
// arrange: init a store
// act: call store.dispatch to create an action
// assert: use store.getState to assert state
describe('TestReduxStateOnly', () => {
    let store: Store<CounterState, CounterAction> | null

    afterEach(() => (store = null))

    it('initial counter to be 0', () => {
        // arrange for every case, init store with specific state
        store = initStore()
        const state = store.getState()
        expect(state.count).toBe(0)
    })

    it('increment action can increase counter', () => {
        store = initStore({ count: 5 })
        // act: dispatch an action
        store.dispatch(incrementActionCreator())
        // assert: getState and assert equality
        const state = store.getState()
        expect(state.count).toBe(6)
    })

    it('decrement action can decrease counter', () => {
        store = initStore({ count: 100 })
        store.dispatch(dencrementActionCreator())
        const state = store.getState()
        expect(state.count).toBe(99)
    })
})

describe('TestReduxReducerOnly', () => {
    it('increment action can increase counter', () => {
        expect(reducer({ count: 5 }, incrementActionCreator())).toEqual({ count: 6 })
    })
    it('decrement action can decrease counter', () => {
        expect(reducer({ count: 100 }, dencrementActionCreator())).toEqual({ count: 99 })
    })
})
