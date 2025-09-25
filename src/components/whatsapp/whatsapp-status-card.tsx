"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Globe, 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Settings,
  ExternalLink,
  QrCode
} from "lucide-react"
import { WhatsAppConnectButton } from "./whatsapp-connect-button"
import { cn } from "@/lib/utils"

interface ConnectionStatus {
  userscript: boolean
  wwebjs: boolean
  lastChecked: Date
}

export function WhatsAppStatusCard({ className }: { className?: string }) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    userscript: false,
    wwebjs: false,
    lastChecked: new Date()
  })
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  const checkConnectionStatus = async () => {
    setIsCheckingStatus(true)
    try {
      // Check userscript status (simplified check)
      const userscriptActive = localStorage.getItem('whatsapp-ai-active') === 'true'
      
      // Check wwebjs server status
      const wwebjsResponse = await fetch('http://localhost:3002/status', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      }).catch(() => ({ ok: false }))
      
      setConnectionStatus({
        userscript: userscriptActive,
        wwebjs: wwebjsResponse.ok,
        lastChecked: new Date()
      })
    } catch (error) {
      console.error('Error checking connection status:', error)
      setConnectionStatus(prev => ({
        ...prev,
        lastChecked: new Date()
      }))
    } finally {
      setIsCheckingStatus(false)
    }
  }

  useEffect(() => {
    checkConnectionStatus()
    
    // Check status every 30 seconds
    const interval = setInterval(checkConnectionStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const isConnected = connectionStatus.userscript || connectionStatus.wwebjs

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp AI Assistant
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={checkConnectionStatus}
              disabled={isCheckingStatus}
            >
              {isCheckingStatus ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Connect WhatsApp AI Assistant to enhance your Second Brain experience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Tampermonkey Userscript</p>
                <p className="text-xs text-muted-foreground">Quick 5-minute setup</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus.userscript ? (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">whatsapp.web.js Server</p>
                <p className="text-xs text-muted-foreground">Professional dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus.wwebjs ? (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Running
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Stopped
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <WhatsAppConnectButton 
            variant="default" 
            size="sm" 
            className="flex-1"
          />
          
          {connectionStatus.wwebjs && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('http://localhost:3002', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Dashboard
            </Button>
          )}
        </div>

        {/* Quick Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Quick Commands:</strong> @ai, !ai, /ai, ai:, assistant:</p>
          <p>📱 <strong>Mobile Access:</strong> Use WhatsApp Web or mobile browser</p>
          <p>🔄 <strong>Last Checked:</strong> {connectionStatus.lastChecked.toLocaleTimeString()}</p>
        </div>

        {/* Status Summary */}
        {isConnected && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">WhatsApp AI Assistant is ready!</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              You can now use @ai commands in any WhatsApp chat
            </p>
          </div>
        )}

        {!isConnected && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Setup required to get started</span>
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Click "Connect WhatsApp" to begin setup (takes 5-15 minutes)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}