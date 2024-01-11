import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home', () => {
  it('should have the title of kendo coach', () => {
    render(<Home/>)

    const element = screen.getByText(/Kendo Coach/i)

    expect(element).toBeInTheDocument()
  })
})