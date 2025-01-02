"use client";

import {
  Form as FormPrimitive,
  type FormProps as FormPrimitiveProps,
} from "react-aria-components";

interface FormProps extends FormPrimitiveProps {
  ref?: React.RefObject<HTMLFormElement>;
  handleSubmit?: () => Promise<void>;
}
const Form = ({ ref, handleSubmit, ...props }: FormProps) => {
  return (
    <FormPrimitive
      ref={ref}
      onSubmit={(e) => {
        if (handleSubmit) {
          e.preventDefault();
          e.stopPropagation();
          void handleSubmit();

          return;
        }

        props.onSubmit?.(e);
      }}
      {...props}
    />
  );
};

export { Form };
export type { FormProps };
