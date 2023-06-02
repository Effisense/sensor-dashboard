import React from "react";
import { RotateSpinner as _RotateSpinner } from "react-spinners-kit";
import { emerald } from "tailwindcss/colors";

interface RotateSpinnerProps {
  size?: number;
  loading: boolean;
}

const RotateSpinner: React.FC<RotateSpinnerProps> = ({ size, loading }) => {
  return (
    <_RotateSpinner size={size || 64} color={emerald[600]} loading={loading} />
  );
};

export default RotateSpinner;
