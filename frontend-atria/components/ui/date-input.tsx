"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { PatternFormat } from "react-number-format";
import {
  displayDateToIso,
  isoDateToDisplay,
} from "@/lib/date-input-utils";
import { cn } from "@/lib/utils";
import { inputClassName } from "@/components/ui/input-styles";

const PatternInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function PatternInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      data-slot="input"
      className={cn(inputClassName, className)}
      {...props}
    />
  );
});

export interface DateInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput(
    {
      className,
      value = "",
      onChange,
      onBlur,
      disabled,
      id,
      name,
      required,
      autoComplete,
      min,
      max,
      readOnly,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
    },
    ref,
  ) {
    const hiddenPickerRef = React.useRef<HTMLInputElement>(null);
    const [displayValue, setDisplayValue] = React.useState(() =>
      isoDateToDisplay(value),
    );

    React.useEffect(() => {
      setDisplayValue(isoDateToDisplay(value));
    }, [value]);

    function emitChange(nextIso: string) {
      onChange?.({
        target: { value: nextIso },
        currentTarget: { value: nextIso },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    function handleDisplayChange(nextDisplay: string) {
      setDisplayValue(nextDisplay);

      if (!nextDisplay.trim()) {
        emitChange("");
        return;
      }

      if (nextDisplay.length < 10) return;

      const iso = displayDateToIso(nextDisplay);
      if (iso !== null) {
        emitChange(iso);
      }
    }

    function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
      if (displayValue.trim()) {
        const iso = displayDateToIso(displayValue);
        if (iso === null) {
          setDisplayValue(isoDateToDisplay(value));
        } else {
          setDisplayValue(isoDateToDisplay(iso));
        }
      }
      onBlur?.(event);
    }

    function openNativePicker() {
      if (disabled) return;
      hiddenPickerRef.current?.showPicker?.();
    }

    function handleNativePickerChange(
      event: React.ChangeEvent<HTMLInputElement>,
    ) {
      const nextIso = event.target.value;
      setDisplayValue(isoDateToDisplay(nextIso));
      emitChange(nextIso);
    }

    return (
      <div className="relative">
        <PatternFormat
          getInputRef={ref}
          customInput={PatternInput}
          format="##/##/####"
          mask="_"
          value={displayValue}
          onValueChange={(values) => handleDisplayChange(values.formattedValue)}
          onBlur={handleBlur}
          disabled={disabled}
          id={id}
          placeholder="dd/mm/yyyy"
          inputMode="numeric"
          className={cn(inputClassName, "pr-9", className)}
          name={name}
          required={required}
          autoComplete={autoComplete}
          min={min}
          max={max}
          readOnly={readOnly}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={openNativePicker}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="Abrir calendário"
        >
          <Calendar className="size-4" />
        </button>
        <input
          ref={hiddenPickerRef}
          type="date"
          value={value}
          onChange={handleNativePickerChange}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          aria-hidden
        />
      </div>
    );
  },
);
