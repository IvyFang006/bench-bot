import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 border-0 border-l-4 border-l-transparent bg-[#f5f6f7] px-3 py-1 text-base text-[#2c2f30] transition-colors outline-none placeholder:text-[#abadae] focus-visible:border-l-[#ffd709] focus-visible:bg-[#ffffff] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-l-[#f95630]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
