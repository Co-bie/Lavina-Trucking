import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
<<<<<<< HEAD
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
=======
          "bg-gradient-to-r from-[#1e786c] to-[#cfab3d] text-white shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        outline:
          "border-2 border-[#1e786c] bg-transparent text-[#1e786c] shadow-sm hover:bg-[#1e786c] hover:text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm hover:from-gray-200 hover:to-gray-300 hover:shadow-md transform hover:scale-105 transition-all duration-200",
        ghost:
          "text-[#1e786c] hover:bg-[#1e786c]/10 hover:text-[#cfab3d] rounded-lg transition-all duration-200",
        link: "text-[#1e786c] underline-offset-4 hover:underline hover:text-[#cfab3d] transition-colors duration-200",
        // Custom trucking-themed variants
        success:
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        warning:
          "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        info:
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        premium:
          "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse",
        neon:
          "bg-black text-[#cfab3d] border-2 border-[#cfab3d] shadow-[0_0_15px_rgba(207,171,61,0.5)] hover:shadow-[0_0_25px_rgba(207,171,61,0.8)] hover:bg-[#cfab3d] hover:text-black transition-all duration-300",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-5 rounded-lg",
        sm: "h-8 rounded-md gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-10 rounded-lg",
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
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
