"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  QrCode, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Clock,
  Copy,
  ExternalLink,
  Download,
  RefreshCw,
  Settings,
  Bot
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsAppConnectButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
}

interface ConnectionStatus {
  userscript: boolean
  wwebjs: boolean
  lastChecked: Date
}

const WHATSAPP_SETUP_METHODS = [
  {
    id: "userscript",
    title: "Tampermonkey (Quick Setup)",
    description: "5-minute setup with browser extension",
    icon: Globe,
    difficulty: "Easy",
    timeRequired: "5 minit",
    features: [
      "✅ Quick setup",
      "✅ Browser-based",
      "✅ No installation required",
      "✅ Mobile friendly via WhatsApp Web"
    ],
    steps: [
      "Install Tampermonkey extension",
      "Copy userscript code",
      "Paste in Tampermonkey editor",
      "Refresh WhatsApp Web",
      "Test with @ai commands"
    ]
  },
  {
    id: "wwebjs",
    title: "whatsapp.web.js (Professional)",
    description: "Advanced features with dedicated server",
    icon: Smartphone,
    difficulty: "Intermediate",
    timeRequired: "15 minit",
    features: [
      "✅ Professional dashboard",
      "✅ Real-time monitoring",
      "✅ Group chat support",
      "✅ Production ready",
      "✅ Web interface included"
    ],
    steps: [
      "Install Node.js dependencies",
      "Run WhatsApp server",
      "Scan QR code with phone",
      "Access web dashboard",
      "Test all features"
    ]
  }
]

export function WhatsAppConnectButton({ 
  className, 
  variant = "default", 
  size = "default", 
  showLabel = true 
}: WhatsAppConnectButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    userscript: false,
    wwebjs: false,
    lastChecked: new Date()
  })
  const [selectedMethod, setSelectedMethod] = useState("userscript")
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  // Check connection status
  const checkConnectionStatus = async () => {
    setIsCheckingStatus(true)
    try {
      // Check userscript status (simplified check)
      const userscriptActive = localStorage.getItem('whatsapp-ai-active') === 'true'
      
      // Check wwebjs server status
      const wwebjsResponse = await fetch('http://localhost:3002/status', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
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
    if (isOpen) {
      checkConnectionStatus()
    }
  }, [isOpen])

  const copyUserscript = () => {
    const userscriptCode = `// ==UserScript==
// @name         WhatsApp AI Assistant - Second Brain
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add AI Assistant functionality to WhatsApp Web
// @author       Second Brain Team
// @match        https://web.whatsapp.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class WhatsAppAIAssistant {
        constructor() {
            this.aiEndpoint = 'http://localhost:3001/api/ai-assistant/chat';
            this.init();
        }

        init() {
            console.log('🤖 WhatsApp AI Assistant initializing...');
            this.waitForWhatsApp();
        }

        waitForWhatsApp() {
            const checkInterval = setInterval(() => {
                if (document.querySelector('#app') && document.querySelector('.app-wrapper-web')) {
                    clearInterval(checkInterval);
                    this.setupAIAssistant();
                }
            }, 1000);
        }

        setupAIAssistant() {
            console.log('✅ WhatsApp AI Assistant ready!');
            this.addAIButton();
            this.setupMessageListener();
        }

        addAIButton() {
            const buttonHTML = \`
                <div id="whatsapp-ai-btn" style="
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    z-index: 9999;
                    background: linear-gradient(45deg, #25D366, #128C7E);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 56px;
                    height: 56px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    transition: all 0.3s ease;
                " title="AI Assistant">
                    🤖
                </div>
            \`;

            document.body.insertAdjacentHTML('beforeend', buttonHTML);

            const btn = document.getElementById('whatsapp-ai-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    this.openAIChat();
                });
            }
        }

        setupMessageListener() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        this.checkForAIMessages(mutation.addedNodes);
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        checkForAIMessages(nodes) {
            nodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const messageElements = node.querySelectorAll('[data-pre-plain-text], .message-text');
                    messageElements.forEach(element => {
                        const messageText = element.textContent || element.innerText;
                        if (this.isAIMessage(messageText)) {
                            this.handleAIMessage(messageText);
                        }
                    });
                }
            });
        }

        isAIMessage(message) {
            const aiTriggers = ['@ai', '!ai', '/ai', 'ai:', 'assistant', 'help'];
            return aiTriggers.some(trigger => 
                message.toLowerCase().includes(trigger)
            );
        }

        async handleAIMessage(message) {
            const command = this.extractCommand(message);
            const response = await this.getAIResponse(command);
            this.showAIResponse(response);
        }

        extractCommand(message) {
            return message
                .replace(/@ai|!ai|\/ai|ai:/gi, '')
                .replace(/assistant|help/gi, '')
                .trim();
        }

        async getAIResponse(command) {
            try {
                const response = await fetch(this.aiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: command,
                        context: 'whatsapp',
                        userId: 'whatsapp-user'
                    })
                });

                const data = await response.json();
                return data.response || data.message || 'Maaf, saya tidak dapat membantu sekarang.';
            } catch (error) {
                console.error('AI Assistant error:', error);
                return 'Maaf, ada masalah dengan sambungan ke AI Assistant.';
            }
        }

        showAIResponse(response) {
            const responseHTML = \`
                <div id="ai-response-popup" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #25D366;
                    border-radius: 12px;
                    padding: 20px;
                    max-width: 400px;
                    z-index: 10001;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3 style="margin: 0; color: #128C7E; font-size: 18px;">🤖 AI Assistant</h3>
                        <button onclick="this.closest('#ai-response-popup').remove()" style="
                            background: none;
                            border: none;
                            font-size: 20px;
                            cursor: pointer;
                            color: #666;
                            padding: 0;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">×</button>
                    </div>
                    <div style="color: #333; line-height: 1.5; font-size: 14px; margin-bottom: 15px;">
                        \${response}
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button onclick="navigator.clipboard.writeText(\`\${response}\`); alert('Disalin!')" style="
                            background: #25D366;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                        ">Copy</button>
                        <button onclick="this.closest('#ai-response-popup').remove()" style="
                            background: #dc3545;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                        ">Tutup</button>
                    </div>
                </div>
            \`;

            const existingPopup = document.getElementById('ai-response-popup');
            if (existingPopup) {
                existingPopup.remove();
            }

            document.body.insertAdjacentHTML('beforeend', responseHTML);
        }

        openAIChat() {
            const chatHTML = \`
                <div id="ai-chat-interface" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #25D366;
                    border-radius: 15px;
                    padding: 20px;
                    width: 450px;
                    max-height: 500px;
                    z-index: 10002;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3 style="margin: 0; color: #128C7E; font-size: 18px;">🤖 AI Assistant</h3>
                        <button onclick="this.closest('#ai-chat-interface').remove()" style="
                            background: none;
                            border: none;
                            font-size: 20px;
                            cursor: pointer;
                            color: #666;
                            padding: 0;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">×</button>
                    </div>
                    
                    <div id="ai-chat-messages" style="
                        height: 250px;
                        overflow-y: auto;
                        border: 1px solid #e0e0e0;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        background: #f8f9fa;
                        font-size: 13px;
                    ">
                        <div style="color: #666; text-align: center; padding: 20px;">
                            Hai! Saya AI Assistant anda. Boleh bantu apa hari ini?
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="ai-chat-input" placeholder="Taip arahan anda..." style="
                            flex: 1;
                            padding: 10px;
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            font-size: 13px;
                        ">
                        <button onclick="window.whatsappAI.sendMessage()" style="
                            background: #25D366;
                            color: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                        ">Hantar</button>
                    </div>
                    
                    <div style="margin-top: 12px; font-size: 11px; color: #666; text-align: center;">
                        💡 Taip "@ai" di WhatsApp untuk arahan cepat
                    </div>
                </div>
            \`;

            const existingChat = document.getElementById('ai-chat-interface');
            if (existingChat) {
                existingChat.remove();
            }

            document.body.insertAdjacentHTML('beforeend', chatHTML);
            
            setTimeout(() => {
                const input = document.getElementById('ai-chat-input');
                if (input) {
                    input.focus();
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            window.whatsappAI.sendMessage();
                        }
                    });
                }
            }, 100);

            window.whatsappAI = this;
        }

        async sendMessage() {
            const input = document.getElementById('ai-chat-input');
            const messagesDiv = document.getElementById('ai-chat-messages');
            const message = input.value.trim();
            
            if (!message) return;
            
            const userMessageHTML = \`
                <div style="margin-bottom: 12px; text-align: right;">
                    <div style="
                        background: #25D366;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 15px;
                        display: inline-block;
                        max-width: 80%;
                        font-size: 12px;
                    ">\${message}</div>
                </div>
            \`;
            messagesDiv.insertAdjacentHTML('beforeend', userMessageHTML);
            
            input.value = '';
            
            const typingHTML = \`
                <div id="ai-typing" style="margin-bottom: 12px;">
                    <div style="
                        background: #e9ecef;
                        color: #666;
                        padding: 8px 12px;
                        border-radius: 15px;
                        display: inline-block;
                        max-width: 80%;
                        font-size: 12px;
                    ">🤖 Menulis...</div>
                </div>
            \`;
            messagesDiv.insertAdjacentHTML('beforeend', typingHTML);
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            
            try {
                const response = await this.getAIResponse(message);
                
                const typingElement = document.getElementById('ai-typing');
                if (typingElement) {
                    typingElement.remove();
                }
                
                const aiMessageHTML = \`
                    <div style="margin-bottom: 12px;">
                        <div style="
                            background: #f1f3f4;
                            color: #333;
                            padding: 8px 12px;
                            border-radius: 15px;
                            display: inline-block;
                            max-width: 80%;
                            font-size: 12px;
                        ">\${response}</div>
                    </div>
                \`;
                messagesDiv.insertAdjacentHTML('beforeend', aiMessageHTML);
                
            } catch (error) {
                const typingElement = document.getElementById('ai-typing');
                if (typingElement) {
                    typingElement.remove();
                }
                
                const errorHTML = \`
                    <div style="margin-bottom: 12px;">
                        <div style="
                            background: #f8d7da;
                            color: #721c24;
                            padding: 8px 12px;
                            border-radius: 15px;
                            display: inline-block;
                            max-width: 80%;
                            font-size: 12px;
                        ">❌ Maaf, ada masalah teknikal.</div>
                    </div>
                \`;
                messagesDiv.insertAdjacentHTML('beforeend', errorHTML);
            }
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new WhatsAppAIAssistant();
        });
    } else {
        new WhatsAppAIAssistant();
    }
})();`
    
    const textarea = document.createElement('textarea')
    textarea.value = userscriptCode
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    
    alert('Userscript code disalin ke clipboard!')
  }

  const downloadUserscript = () => {
    const userscriptCode = `// ==UserScript==
// @name         WhatsApp AI Assistant - Second Brain
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add AI Assistant functionality to WhatsApp Web
// @author       Second Brain Team
// @match        https://web.whatsapp.com/*
// @grant        none
// ==/UserScript==

// Full userscript code would be here...
// This is a placeholder for download functionality`
    
    const blob = new Blob([userscriptCode], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'whatsapp-ai-userscript.user.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const openDashboard = () => {
    window.open('http://localhost:3002', '_blank')
  }

  const selectedMethodData = WHATSAPP_SETUP_METHODS.find(m => m.id === selectedMethod)

  if (!showLabel && size === "icon") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant={variant} size={size} className={cn("relative", className)}>
            <MessageSquare className="h-4 w-4" />
            {(connectionStatus.userscript || connectionStatus.wwebjs) && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              WhatsApp AI Assistant Setup
            </DialogTitle>
            <DialogDescription>
              Connect WhatsApp AI Assistant to your Second Brain system
            </DialogDescription>
          </DialogHeader>
          
          {/* Content will be the same as below */}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={cn("relative gap-2", className)}>
          <MessageSquare className="h-4 w-4" />
          {showLabel && "Connect WhatsApp"}
          {(connectionStatus.userscript || connectionStatus.wwebjs) && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp AI Assistant Setup
          </DialogTitle>
          <DialogDescription>
            Connect WhatsApp AI Assistant to your Second Brain system
          </DialogDescription>
        </DialogHeader>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Tampermonkey Userscript</span>
              </div>
              <div className="flex items-center gap-2">
                {connectionStatus.userscript ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="outline" className="text-green-600 border-green-200">Connected</Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <Badge variant="outline" className="text-red-600 border-red-200">Not Connected</Badge>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-medium">whatsapp.web.js Server</span>
              </div>
              <div className="flex items-center gap-2">
                {connectionStatus.wwebjs ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="outline" className="text-green-600 border-green-200">Connected</Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <Badge variant="outline" className="text-red-600 border-red-200">Not Connected</Badge>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                Last checked: {connectionStatus.lastChecked.toLocaleTimeString()}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkConnectionStatus}
                disabled={isCheckingStatus}
              >
                {isCheckingStatus ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Setup Methods */}
        <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
          <TabsList className="grid w-full grid-cols-2">
            {WHATSAPP_SETUP_METHODS.map((method) => (
              <TabsTrigger key={method.id} value={method.id} className="text-xs">
                <method.icon className="h-3 w-3 mr-1" />
                {method.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {WHATSAPP_SETUP_METHODS.map((method) => (
            <TabsContent key={method.id} value={method.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <method.icon className="h-5 w-5" />
                        {method.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {method.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline">{method.difficulty}</Badge>
                      <span className="text-xs text-muted-foreground">{method.timeRequired}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Features:</h4>
                    <div className="space-y-1">
                      {method.features.map((feature, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Setup Steps */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Setup Steps:</h4>
                    <ol className="space-y-2">
                      {method.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs">
                          <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t">
                    {method.id === "userscript" ? (
                      <>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={copyUserscript}
                          className="flex-1"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Code
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadUserscript}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open('https://www.tampermonkey.net/', '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Tampermonkey
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={openDashboard}
                          className="flex-1"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open Dashboard
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open('https://github.com/cornmankl/second-brain-concept-1/blob/main/WHATSAPP_WWEBJS_SETUP.md', '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Setup Guide
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Test Commands */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Test Commands
            </CardTitle>
            <CardDescription>
              Try these commands after setup to test the connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "@ai tolong buatkan saya daily schedule",
                "!ai berikan saya 5 idea untuk project",
                "/ai tips untuk belajar lebih efektif",
                "ai: bantu saya solve masalah productivity"
              ].map((command, index) => (
                <div key={index} className="p-2 bg-muted rounded text-xs font-mono">
                  {command}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}