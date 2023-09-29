import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

interface ColorParams {
  primary?: boolean;
  secondary?: boolean;
  success?: boolean;
  error?: boolean;
  info?: boolean;
  warning?: boolean;
}

interface ButtonProps extends MuiButtonProps, ColorParams {
  label: string;
}

const getColor = (colors: ColorParams): any =>
  Object.entries(colors).reduce((acc, [key, value]) => {
    if (acc) return acc;
    if (value) return key;
  }, '');

export const Button = ({
  color: colorParam,
  primary,
  secondary,
  success,
  error,
  info,
  warning,
  label,
  variant = 'contained',
  ...props
}: ButtonProps) => (
  <MuiButton
    color={
      colorParam || getColor({ primary, secondary, success, error, info, warning }) || 'primary'
    }
    variant={variant}
    {...props}
  >
    {label}
  </MuiButton>
);

export default Button;
