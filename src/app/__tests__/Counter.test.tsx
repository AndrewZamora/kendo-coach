
import '@testing-library/jest-dom'
import { render, screen, cleanup } from '@testing-library/react'
import Counter from '../components/Counter'

afterEach(cleanup)

describe('Counter', () => {
  it('should have the word "Count"', () => {
    render(<Counter count={0} />)

    const element = screen.getByText(/Count:/i)

    expect(element).toBeInTheDocument()
  })
  it('should display proper count', () => {
    render(<Counter count={5} />)

    const element = screen.getByText(/5/i)

    expect(element).toBeInTheDocument()
  })
  it('should update count', () => {
    const { rerender } = render(<Counter count={5} />)
    rerender(<Counter count={6} />)

    const element = screen.getByText(/6/i)

    expect(element).toBeInTheDocument()
  })
})