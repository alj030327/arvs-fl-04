import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, CheckCircle2 } from "lucide-react"

interface BlockchainBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "secure" | "verified" | "immutable"
  size?: "sm" | "md" | "lg"
}

const BlockchainBadge = ({ className, variant = "secure", size = "md", ...props }: BlockchainBadgeProps) => {
    const icons = {
      secure: Shield,
      verified: CheckCircle2,
      immutable: Lock
    }
    
    const texts = {
      secure: "Blockchain Secured",
      verified: "Blockchain Verified", 
      immutable: "Immutable Record"
    }
    
    const sizes = {
      sm: "text-xs px-2 py-1",
      md: "text-sm px-3 py-1.5", 
      lg: "text-base px-4 py-2"
    }
    
    const Icon = icons[variant]
    
    return (
      <Badge
        className={cn(
          "bg-gradient-to-r from-primary via-primary-glow to-primary",
          "text-primary-foreground border-0 shadow-lg",
          "hover:shadow-[var(--shadow-glow)] transition-all duration-300",
          "flex items-center gap-1.5 font-medium",
          sizes[size],
          className
        )}
        {...props}
      >
        <Icon className="h-3 w-3" />
        {texts[variant]}
      </Badge>
    )
}
BlockchainBadge.displayName = "BlockchainBadge"

export { BlockchainBadge }