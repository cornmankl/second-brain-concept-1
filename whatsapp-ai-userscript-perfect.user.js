// ==UserScript==
// @name         WhatsApp AI Assistant - Second Brain
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add AI Assistant functionality to WhatsApp Web - Integrated with Second Brain System
// @author       Second Brain Team
// @match        https://web.whatsapp.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class WhatsAppAIAssistant {
        constructor() {
            this.aiEndpoint = 'http://localhost:3001/api/ai-assistant/chat';
            this.isInitialized = false;
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
            this.isInitialized = true;
        }

        addAIButton() {
            // Remove existing button if any
            const existingBtn = document.getElementById('whatsapp-ai-btn');
            if (existingBtn) {
                existingBtn.remove();
            }

            const buttonHTML = `
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
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                " title="AI Assistant - Second Brain">
                    🤖
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', buttonHTML);

            // Add hover effect
            const btn = document.getElementById('whatsapp-ai-btn');
            if (btn) {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'scale(1.1)';
                    btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'scale(1)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                });

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
                    // Check for various message element selectors
                    const messageElements = node.querySelectorAll(
                        '[data-pre-plain-text], .message-text, [class*="message"], [class*="text"], div[role="region"] span'
                    );
                    messageElements.forEach(element => {
                        const messageText = element.textContent || element.innerText;
                        if (messageText && this.isAIMessage(messageText)) {
                            // Prevent duplicate processing
                            if (!element.dataset.aiProcessed) {
                                element.dataset.aiProcessed = 'true';
                                this.handleAIMessage(messageText);
                            }
                        }
                    });
                }
            });
        }

        isAIMessage(message) {
            if (!message || typeof message !== 'string') return false;
            
            const aiTriggers = ['@ai', '!ai', '/ai', 'ai:', 'assistant:', 'help:', 'bot:'];
            const lowerMessage = message.toLowerCase().trim();
            
            return aiTriggers.some(trigger => 
                lowerMessage.startsWith(trigger) || lowerMessage.includes(' ' + trigger)
            );
        }

        async handleAIMessage(message) {
            const command = this.extractCommand(message);
            if (command) {
                const response = await this.getAIResponse(command);
                this.showAIResponse(response, command);
            }
        }

        extractCommand(message) {
            if (!message) return '';
            
            return message
                .replace(/@ai|!ai|\/ai|ai:|assistant:|help:|bot:/gi, '')
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
                        userId: 'whatsapp-user',
                        currentSection: 'whatsapp-integration'
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.response || data.message || 'Maaf, saya tidak dapat membantu sekarang.';
            } catch (error) {
                console.error('AI Assistant error:', error);
                return 'Maaf, ada masalah dengan sambungan ke AI Assistant. Sila cuba lagi kemudian.';
            }
        }

        showAIResponse(response, originalCommand = '') {
            // Remove existing popup
            const existingPopup = document.getElementById('ai-response-popup');
            if (existingPopup) {
                existingPopup.remove();
            }

            const escapedResponse = this.escapeHtml(response);
            const escapedCommand = this.escapeHtml(originalCommand);

            const responseHTML = `
                <div id="ai-response-popup" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #25D366;
                    border-radius: 12px;
                    padding: 20px;
                    max-width: 450px;
                    max-height: 80vh;
                    overflow-y: auto;
                    z-index: 10001;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3 style="margin: 0; color: #128C7E; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                            🤖 AI Assistant
                        </h3>
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
                            border-radius: 50%;
                            transition: background-color 0.2s;
                        " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">×</button>
                    </div>
                    
                    ${originalCommand ? `
                    <div style="background: #f8f9fa; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 12px; color: #666; border-left: 3px solid #25D366;">
                        <strong>Arahan:</strong> ${escapedCommand}
                    </div>
                    ` : ''}
                    
                    <div style="color: #333; line-height: 1.6; font-size: 14px; margin-bottom: 15px; white-space: pre-wrap;">
                        ${escapedResponse}
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
                        <button onclick="navigator.clipboard.writeText(\`${escapedResponse}\`).then(() => {
                            this.textContent = 'Disalin!';
                            this.style.backgroundColor = '#28a745';
                            setTimeout(() => {
                                this.textContent = 'Copy';
                                this.style.backgroundColor = '#25D366';
                            }, 2000);
                        }).catch(() => {
                            alert('Gagal menyalin. Sila copy manual.');
                        });" style="
                            background: #25D366;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 500;
                            transition: background-color 0.2s;
                        " onmouseover="this.style.backgroundColor='#128C7E'" onmouseout="this.style.backgroundColor='#25D366'">Copy</button>
                        
                        <button onclick="this.closest('#ai-response-popup').remove()" style="
                            background: #dc3545;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 500;
                            transition: background-color 0.2s;
                        " onmouseover="this.style.backgroundColor='#c82333'" onmouseout="this.style.backgroundColor='#dc3545'">Tutup</button>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', responseHTML);
        }

        openAIChat() {
            // Remove existing chat interface
            const existingChat = document.getElementById('ai-chat-interface');
            if (existingChat) {
                existingChat.remove();
            }

            const chatHTML = `
                <div id="ai-chat-interface" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #25D366;
                    border-radius: 15px;
                    padding: 20px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 85vh;
                    z-index: 10002;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    flex-direction: column;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-shrink: 0;">
                        <h3 style="margin: 0; color: #128C7E; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                            🤖 AI Assistant - Second Brain
                        </h3>
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
                            border-radius: 50%;
                            transition: background-color 0.2s;
                        " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">×</button>
                    </div>
                    
                    <div id="ai-chat-messages" style="
                        flex: 1;
                        overflow-y: auto;
                        border: 1px solid #e0e0e0;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        background: #f8f9fa;
                        font-size: 13px;
                        min-height: 200px;
                        max-height: 400px;
                    ">
                        <div style="color: #666; text-align: center; padding: 20px;">
                            🧠 Hai! Saya AI Assistant dari Second Brain system anda.<br>
                            Saya boleh bantu anda dengan:<br>
                            • Analisis idea & pembangunan projek<br>
                            • Sintesis pengetahuan & pembelajaran<br>
                            • Penetapan matlamat SMART<br>
                            • Pengurusan tugas & produktiviti<br>
                            • Cadangan kandungan pembelajaran<br>
                            • Cadangan habit & personal development<br><br>
                            Apa yang saya boleh bantu hari ini? 😊
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-shrink: 0;">
                        <input type="text" id="ai-chat-input" placeholder="Taip arahan anda..." style="
                            flex: 1;
                            padding: 12px;
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            font-size: 13px;
                            outline: none;
                            transition: border-color 0.2s;
                        " onfocus="this.style.borderColor='#25D366'" onblur="this.style.borderColor='#ddd'">
                        <button onclick="window.whatsappAI.sendMessage()" style="
                            background: #25D366;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                            transition: background-color 0.2s;
                        " onmouseover="this.style.backgroundColor='#128C7E'" onmouseout="this.style.backgroundColor='#25D366'">Hantar</button>
                    </div>
                    
                    <div style="font-size: 11px; color: #666; text-align: center; flex-shrink: 0;">
                        💡 Quick tips: Tek Enter untuk hantar • Taip "@ai" di WhatsApp untuk arahan cepat • 
                        <span style="color: #25D366; cursor: pointer;" onclick="window.open('https://second-brain-concept-1.vercel.app', '_blank')">Buka Second Brain</span>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', chatHTML);
            
            // Focus on input
            setTimeout(() => {
                const input = document.getElementById('ai-chat-input');
                if (input) {
                    input.focus();
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            window.whatsappAI.sendMessage();
                        }
                    });
                }
            }, 100);

            // Store reference globally
            window.whatsappAI = this;
        }

        async sendMessage() {
            const input = document.getElementById('ai-chat-input');
            const messagesDiv = document.getElementById('ai-chat-messages');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Add user message
            const userMessageHTML = `
                <div style="margin-bottom: 12px; text-align: right;">
                    <div style="
                        background: #25D366;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 15px;
                        display: inline-block;
                        max-width: 80%;
                        font-size: 12px;
                        word-wrap: break-word;
                    ">${this.escapeHtml(message)}</div>
                    <div style="font-size: 10px; color: #999; margin-top: 2px; text-align: right;">
                        ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            `;
            messagesDiv.insertAdjacentHTML('beforeend', userMessageHTML);
            
            input.value = '';
            
            // Show typing indicator
            const typingHTML = `
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
            `;
            messagesDiv.insertAdjacentHTML('beforeend', typingHTML);
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            
            try {
                const response = await this.getAIResponse(message);
                
                // Remove typing indicator
                const typingElement = document.getElementById('ai-typing');
                if (typingElement) {
                    typingElement.remove();
                }
                
                // Add AI response
                const aiMessageHTML = `
                    <div style="margin-bottom: 12px;">
                        <div style="
                            background: #f1f3f4;
                            color: #333;
                            padding: 8px 12px;
                            border-radius: 15px;
                            display: inline-block;
                            max-width: 80%;
                            font-size: 12px;
                            word-wrap: break-word;
                            white-space: pre-wrap;
                        ">${this.escapeHtml(response)}</div>
                        <div style="font-size: 10px; color: #999; margin-top: 2px;">
                            🤖 AI Assistant • ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                `;
                messagesDiv.insertAdjacentHTML('beforeend', aiMessageHTML);
                
            } catch (error) {
                // Remove typing indicator
                const typingElement = document.getElementById('ai-typing');
                if (typingElement) {
                    typingElement.remove();
                }
                
                // Show error
                const errorHTML = `
                    <div style="margin-bottom: 12px;">
                        <div style="
                            background: #f8d7da;
                            color: #721c24;
                            padding: 8px 12px;
                            border-radius: 15px;
                            display: inline-block;
                            max-width: 80%;
                            font-size: 12px;
                        ">❌ Maaf, ada masalah teknikal. Sila cuba lagi.</div>
                    </div>
                `;
                messagesDiv.insertAdjacentHTML('beforeend', errorHTML);
            }
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

    // Initialize when page loads
    function initializeWhatsAppAI() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new WhatsAppAIAssistant();
            });
        } else {
            new WhatsAppAIAssistant();
        }
    }

    // Handle page navigation in WhatsApp Web
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                if (!document.querySelector('#whatsapp-ai-btn')) {
                    initializeWhatsAppAI();
                }
            }, 2000);
        }
    }).observe(document, { subtree: true, childList: true });

    // Initial initialization
    initializeWhatsAppAI();

    console.log('🤖 WhatsApp AI Assistant - Second Brain Integration loaded!');
    console.log('💡 Tips: Use @ai, !ai, or /ai in any chat to trigger AI assistance');
})();