import type { ComponentProps } from "react";
import { getButtonLook, type ButtonVariant } from "./buttonLook";

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

// A plain <button> in the theme's look. `variant` picks the fill colour.
export function Button({ variant = "plain", className = "", type = "button", ...buttonProps }: ButtonProps) {
  return <button type={type} className={getButtonLook(variant, className)} {...buttonProps} />;
}
