import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap uppercase tracking-[0.05em] transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0",
  {
    variants: {
      variant: {
        default: "bg-[#ffd709] text-[#1d1d00] shadow-[4px_4px_0px_0px_#6c5a00] hover:shadow-[2px_2px_0px_0px_#6c5a00,0_0_16px_rgba(255,215,9,0.3)]",
        outline:
          "border-[rgba(171,173,174,0.2)] bg-[#ffffff] text-[#2c2f30] shadow-[4px_4px_0px_0px_#e6e8ea] hover:shadow-[2px_2px_0px_0px_#e6e8ea] hover:bg-[#f5f6f7]",
        secondary:
          "bg-[#54e3fc] text-[#003a43] shadow-[4px_4px_0px_0px_#006573] hover:shadow-[2px_2px_0px_0px_#006573,0_0_16px_rgba(84,227,252,0.3)]",
        ghost:
          "text-[#54e3fc] hover:bg-[#54e3fc]/10 hover:translate-y-0 hover:translate-x-0 shadow-none hover:shadow-none",
        destructive:
          "bg-[#f95630]/10 text-[#f95630] shadow-[4px_4px_0px_0px_rgba(249,86,48,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(249,86,48,0.2)]",
        link: "text-[#54e3fc] underline-offset-4 hover:underline hover:translate-y-0 hover:translate-x-0 shadow-none hover:shadow-none",
      },
      size: {
        default: "h-8 gap-1.5 px-3",
        xs: "h-6 gap-1 px-2 text-xs",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem]",
        lg: "h-9 gap-1.5 px-4",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
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
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
