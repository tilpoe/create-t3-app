"use client";

import {
  composeRenderProps,
  Link as LinkPrimitive,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

import { buildRoute } from "~/lib/routes/shared";

export type LinkParams<TRoute extends Route> =
  Router[TRoute]["hasDynamicPathSegments"] extends true
    ? { params: Router[TRoute]["params"] }
    : { params?: undefined };

export type LinkRoute<TRoute extends Route> = {
  to: TRoute;
} & LinkParams<TRoute>;

const linkStyles = tv({
  base: [
    "relative data-focus-visible:outline-2 outline-offset-2 outline-0 data-focused:outline-hidden outline-primary transition-colors",
    "forced-colors:outline-[Highlight] forced-colors:data-disabled:text-[GrayText] data-disabled:data-focus-visible:outline-0",
    "disabled:cursor-default data-disabled:opacity-60",
  ],
  variants: {
    intent: {
      unstyled: "text-current",
      primary:
        "text-fg data-hovered:underline forced-colors:data-disabled:text-[GrayText]",
      secondary:
        "text-muted-fg data-hovered:text-secondary-fg forced-colors:data-disabled:text-[GrayText]",
    },
  },
  defaultVariants: {
    intent: "unstyled",
  },
});

interface LinkProps<TRoute extends Route>
  extends LinkPrimitiveProps,
    VariantProps<typeof linkStyles> {
  ref?: React.RefObject<HTMLAnchorElement>;
  route?: LinkRoute<TRoute>;
}

const Link = <TRoute extends Route>({
  className,
  ref,
  route,
  href,
  ...props
}: LinkProps<TRoute>) => {
  const getHref = () => {
    if (route === undefined) {
      return href;
    }

    return buildRoute(route);
  };

  return (
    <LinkPrimitive
      ref={ref}
      {...props}
      className={composeRenderProps(className, (className, ...renderProps) =>
        linkStyles({ ...renderProps, intent: props.intent, className })
      )}
      href={getHref()}
    >
      {(values) => (
        <>
          {typeof props.children === "function"
            ? props.children(values)
            : props.children}
        </>
      )}
    </LinkPrimitive>
  );
};

export { Link };
export type { LinkProps };
