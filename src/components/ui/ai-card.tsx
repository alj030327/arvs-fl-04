import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Sparkles, Zap } from "lucide-react"

interface AICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  capabilities: string[]
  badge?: string
  icon?: React.ReactNode
  aiPowered?: boolean
}

const AICard = React.forwardRef<HTMLDivElement, AICardProps>(
  ({ className, title, description, capabilities, badge, icon, aiPowered = true, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden group hover:shadow-sm transition-all duration-300 border-0",
          "bg-gradient-to-br from-card via-card to-primary/5",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:via-transparent before:to-primary-glow/10",
          "before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100",
          className
        )}
        {...props}
      >
        {aiPowered && (
          <div className="absolute top-4 right-4 opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
        )}
        
        {badge && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-0 shadow-lg">
              {badge}
            </Badge>
          </div>
        )}

        <CardHeader className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {icon || <Bot className="h-6 w-6 text-primary" />}
            </div>
            {aiPowered && (
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                <Zap className="h-3 w-3" />
                AI-Powered
              </div>
            )}
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative space-y-4">
          <CardDescription className="text-base leading-relaxed">
            {description}
          </CardDescription>
          
          <div className="space-y-2">
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-primary-glow rounded-full" />
                <span className="text-muted-foreground">{capability}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
)
AICard.displayName = "AICard"

export { AICard }