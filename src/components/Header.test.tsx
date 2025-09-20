import React from 'react';
import { render } from '@testing-library/react-native';
import Header from './Header';

jest.mock('../../assets/logo.svg', () => 'Logo');

describe('Header', () => {
  it('renders the logo', () => {
    const { getByTestId } = render(<Header />);
    expect(getByTestId('header-logo')).toBeTruthy();
  });
});
