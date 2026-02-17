import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#0066ff] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#0066ff] text-white hover:bg-[#003d99]",
        primary: "bg-[#0066ff] text-white hover:bg-[#003d99]",
        secondary:
          "border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white bg-transparent",
        destructive: "bg-[#ef4444] text-white hover:bg-[#dc2626]",
        outline:
          "border-2 border-[#e2e8f0] text-[#1a1a1a] hover:bg-[#f8f8f8] hover:border-[#0066ff]",
        ghost: "hover:bg-[#e2e8f0] text-[#1a1a1a]",
        link: "text-[#0066ff] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
