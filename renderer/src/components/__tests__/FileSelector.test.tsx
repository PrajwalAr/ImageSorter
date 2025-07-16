/// <reference types="@testing-library/jest-dom" />
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FileSelector from '../FileSelector'

describe('FileSelector', () => {
  afterEach(() => cleanup())

  it('renders button with correct label', () => {
    render(<FileSelector label="Selector1" onClick={vi.fn()} />)
    expect(screen.getByText('Selector1')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const mockOnClick = vi.fn()
    render(<FileSelector label="Selector2" onClick={mockOnClick} />)
    fireEvent.click(screen.getByText('Selector2'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<FileSelector label="Selector3" onClick={vi.fn()} disabled />)
    expect(screen.getByText('Selector3')).toBeDisabled()
  })

  it('shows loading spinner when loading prop is true', () => {
    render(<FileSelector label="Selector4" onClick={vi.fn()} loading />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
