import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app brand name', () => {
  render(<App />);
  const brand = screen.getByText(/Note Manager/i);
  expect(brand).toBeInTheDocument();
});
