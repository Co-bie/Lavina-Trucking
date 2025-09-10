import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onChange, disabled, ...props }, ref) => {
    return (
      <label className={cn("relative inline-flex items-center cursor-pointer", disabled && "cursor-not-allowed opacity-50")}>
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <div className={cn(
          "w-11 h-6 rounded-full transition-colors relative",
          checked ? "bg-[#1e786c]" : "bg-gray-200",
          className
        )}>
          <div className={cn(
            "absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}></div>
        </div>
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
