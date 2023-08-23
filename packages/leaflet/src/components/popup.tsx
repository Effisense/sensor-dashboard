import { PopupProps as _PopupProps, Popup as _Popup } from "react-leaflet";
import { ReactNode } from "react";

export interface PopupProps extends _PopupProps {
  children: ReactNode;
}

export const Popup = ({ children, ...props }: PopupProps) => {
  return <_Popup {...props}>{children}</_Popup>;
};
