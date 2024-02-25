import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home', () => {
  it('should render', () => {
    render(<Home/>)
  })
})