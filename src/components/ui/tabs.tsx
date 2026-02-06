import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={className} data-value={value} data-onchange={onValueChange as unknown as string}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ value?: string; activeValue?: string; onValueChange?: (v: string) => void }>, { activeValue: value, onValueChange })
        }
        return child
      })}
    </div>
  )
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  activeValue?: string
  onValueChange?: (value: string) => void
}

function TabsList({ className, children, activeValue, onValueChange, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ activeValue?: string; onValueChange?: (v: string) => void }>, { activeValue, onValueChange })
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  activeValue?: string
  onValueChange?: (value: string) => void
}

function TabsTrigger({ className, value, activeValue, onValueChange, ...props }: TabsTriggerProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none cursor-pointer",
        activeValue === value
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-background/50",
        className
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    />
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  activeValue?: string
}

function TabsContent({ className, value, activeValue, ...props }: TabsContentProps) {
  if (activeValue !== value) return null
  return <div className={cn("mt-2", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
