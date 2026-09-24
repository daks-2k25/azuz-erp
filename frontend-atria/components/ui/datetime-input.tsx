"use client";

import * as React from "react";
import { CalendarClock } from "lucide-react";
import { PatternFormat } from "react-number-format";
import {
  dateTimeLocalToDisplay,
  displayDateTimeToLocal,
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

export interface DateTimeInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateTimeInput = React.forwardRef<
  HTMLInputElement,
  DateTimeInputProps
>(function DateTimeInput(
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
    dateTimeLocalToDisplay(value),
  );

  React.useEffect(() => {
    setDisplayValue(dateTimeLocalToDisplay(value));
  }, [value]);

  function emitChange(nextLocal: string) {
    onChange?.({
      target: { value: nextLocal },
      currentTarget: { value: nextLocal },
    } as React.ChangeEvent<HTMLInputElement>);
  }

  function handleDisplayChange(nextDisplay: string) {
    setDisplayValue(nextDisplay);

    if (!nextDisplay.trim()) {
      emitChange("");
      return;
    }

    if (nextDisplay.length < 16) return;

    const localValue = displayDateTimeToLocal(nextDisplay);
    if (localValue !== null) {
      emitChange(localValue);
    }
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    if (displayValue.trim()) {
      const localValue = displayDateTimeToLocal(displayValue);
      if (localValue === null) {
        setDisplayValue(dateTimeLocalToDisplay(value));
      } else {
        setDisplayValue(dateTimeLocalToDisplay(localValue));
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
    const nextLocal = event.target.value;
    setDisplayValue(dateTimeLocalToDisplay(nextLocal));
    emitChange(nextLocal);
  }

  return (
    <div className="relative">
      <PatternFormat
        getInputRef={ref}
        customInput={PatternInput}
        format="##/##/#### ##:##"
        mask="_"
        value={displayValue}
        onValueChange={(values) => handleDisplayChange(values.formattedValue)}
        onBlur={handleBlur}
        disabled={disabled}
        id={id}
        placeholder="dd/mm/yyyy HH:mm"
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
        aria-label="Abrir seletor de data e hora"
      >
        <CalendarClock className="size-4" />
      </button>
      <input
        ref={hiddenPickerRef}
        type="datetime-local"
        value={value}
        onChange={handleNativePickerChange}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
});
