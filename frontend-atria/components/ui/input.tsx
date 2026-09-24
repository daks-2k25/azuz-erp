import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"
import { DateInput } from "@/components/ui/date-input"
import { DateTimeInput } from "@/components/ui/datetime-input"
import { inputClassName } from "@/components/ui/input-styles"

export { inputClassName }

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function Input({ className, type, value, ...props }, ref) {
    const stringValue =
      value === undefined || value === null ? undefined : String(value);

    if (type === "date") {
      return (
        <DateInput
          ref={ref}
          className={className}
          value={stringValue}
          {...props}
        />
      )
    }

    if (type === "datetime-local") {
      return (
        <DateTimeInput
          ref={ref}
          className={className}
          value={stringValue}
          {...props}
        />
      )
    }

    return (
      <InputPrimitive
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputClassName, className)}
        value={value}
        {...props}
      />
    )
  },
)

Input.displayName = "Input"

export { Input }
