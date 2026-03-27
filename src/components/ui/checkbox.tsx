"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center border-2 border-[#abadae] bg-[#f5f6f7] transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-[#ffd709] focus-visible:ring-3 focus-visible:ring-[#ffd709]/30 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-[#6c5a00] data-checked:bg-[#ffd709] data-checked:text-[#1d1d00]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
