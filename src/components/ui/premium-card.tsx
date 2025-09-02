import * as React from "react"
import { cn } from "@/lib/utils"

export interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "premium" | "enterprise" | "floating"
  glow?: boolean
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = "default", glow = false, ...props }, ref) => {
    const baseClasses = "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300"
    
    const variantClasses = {
      default: "hover:shadow-md",
      premium: "border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:shadow-[var(--shadow-elegant)] hover:scale-105",
      enterprise: "border-accent/30 bg-gradient-to-br from-card via-card to-accent/5 hover:shadow-[var(--shadow-premium)] hover:scale-105",
      floating: "shadow-[var(--shadow-float)] hover:shadow-[var(--shadow-premium)] hover:scale-105 border-primary/10"
    }
    
    const glowClasses = glow ? "animate-glow" : ""
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          glowClasses,
          className
        )}
        {...props}
      />
    )
  }
)
PremiumCard.displayName = "PremiumCard"

const PremiumCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
PremiumCardHeader.displayName = "PremiumCardHeader"

const PremiumCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
PremiumCardTitle.displayName = "PremiumCardTitle"

const PremiumCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
PremiumCardDescription.displayName = "PremiumCardDescription"

const PremiumCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
PremiumCardContent.displayName = "PremiumCardContent"

const PremiumCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
PremiumCardFooter.displayName = "PremiumCardFooter"

export { 
  PremiumCard, 
  PremiumCardHeader, 
  PremiumCardFooter, 
  PremiumCardTitle, 
  PremiumCardDescription, 
  PremiumCardContent 
}