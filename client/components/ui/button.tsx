import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[--radius-base] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-2 border-border shadow-[var(--shadow)] hover:shadow-none hover:translate-x-[-2px] hover:translate-y-[4px] active:shadow-none active:translate-x-[-2px] active:translate-y-[4px]",
  {
    variants: {
      variant: {
        default:
          "bg-main text-main-foreground",
        destructive:
          "bg-chart-4 text-white",
        outline:
          "bg-background text-foreground hover:bg-secondary-background",
        secondary:
          "bg-secondary-background text-foreground",
        ghost:
          "border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-secondary-background active:translate-x-0 active:translate-y-0",
        link: "border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0 text-main underline-offset-4 hover:underline active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
