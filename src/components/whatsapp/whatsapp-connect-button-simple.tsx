"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface WhatsAppConnectButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
}

export function WhatsAppConnectButton({ 
  className, 
  variant = "default", 
  size = "default", 
  showLabel = true 
}: WhatsAppConnectButtonProps) {
  return (
    <Button variant={variant} size={size} className={className}>
      <MessageSquare className="h-4 w-4 mr-2" />
      {showLabel && "Connect WhatsApp"}
    </Button>
  )
}