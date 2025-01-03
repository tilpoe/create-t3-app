import { Slot } from "@radix-ui/react-slot";

export const Icon = ({
  className,
  comp,
}: {
  className?: string;
  comp: React.ReactNode;
}) => {
  return (
    <Slot data-slot="icon" className={className}>
      {comp}
    </Slot>
  );
};
