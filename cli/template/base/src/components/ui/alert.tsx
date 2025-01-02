import { Slot } from "@radix-ui/react-slot";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "~/lib/classes";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

export const alertVariants = tv({
  base: "relative grid w-full grid-cols-[auto_1fr] items-start gap-3 rounded-xl border p-4 text-sm",
  variants: {
    type: {
      default: "bg-bg text-fg",
      error: "border-danger bg-danger/10 text-danger",
      info: "bg-blue-500/10 text-blue-500 border-blue-500",
      warning: "bg-warning/10 text-warning border-warning",
      success: "bg-success/10 text-success border-success",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Root ---------------------------------- */

const IconWrapper = (props: { children: React.ReactNode }) => {
  return <Slot {...props} className="h-5 w-5" />;
};

export interface AlertProps
  extends React.ComponentPropsWithRef<"div">,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode | null;
}

export const Alert = (props: AlertProps) => {
  const { icon, children, className, type, ...alertProps } = props;

  const Icon = (function selectIcon() {
    switch (type) {
      case "error":
        return <AlertCircleIcon />;
      case "info":
        return <InfoIcon />;
      case "warning":
        return <AlertTriangleIcon />;
      case "success":
        return <CheckCircle2Icon />;
      default:
        return icon;
    }
  })();

  return (
    <div
      {...alertProps}
      role={type === "error" ? "alert" : props.role}
      className={cn(alertVariants({ type }), className)}
    >
      {Icon && <IconWrapper>{Icon}</IconWrapper>}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

/* ---------------------------------- Title --------------------------------- */

export type AlertTitleProps = React.ComponentPropsWithRef<"div">;

export const AlertTitle = ({ className, ...props }: AlertTitleProps) => {
  return (
    <h5
      {...props}
      className={cn("mb-1 leading-none font-medium tracking-tight", className)}
    />
  );
};

/* ------------------------------- Description ------------------------------ */

export type AlertDescriptionProps = React.ComponentPropsWithRef<"div">;

export const AlertDescription = ({
  className,
  ...props
}: AlertDescriptionProps) => {
  return (
    <p {...props} className={cn("text-sm [&_p]:leading-relaxed", className)} />
  );
};
