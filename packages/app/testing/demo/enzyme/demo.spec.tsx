import React from 'react'
import { mountTest } from '../../helpers/mountTest'
import { Button } from './demo.button'

describe('Button', () => {
    mountTest(Button)
    it('renders correctly', () => {
        expect(<Button>DEMO</Button>).toMatchRenderedSnapshot()
    })
})
