# 🤖 WhatsApp AI Assistant Setup Instructions

## 🎯 Cara Paling Mudah: WhatsApp Web + Userscript

### Step 1: Install Tampermonkey
1. Buka [Tampermonkey](https://www.tampermonkey.net/)
2. Install extension untuk browser anda
3. Restart browser

### Step 2: Install Userscript
1. Klik ikon Tampermonkey di browser
2. Pilih "Create new script"
3. Copy semua kod dari bawah dan paste
4. Save script (Ctrl+S)

### Step 3: Gunakan di WhatsApp Web
1. Buka [WhatsApp Web](https://web.whatsapp.com/)
2. Scan QR code dengan phone anda
3. Anda akan nampak butang 🤖 di kanan bawah
4. Klik butang untuk buka AI Assistant

---

## 📝 Userscript Code (Copy semua ini)

```javascript
// ==UserScript==
// @name         WhatsApp AI Assistant
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add AI Assistant functionality to WhatsApp Web
// @author       Your Name
// @match        https://web.whatsapp.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class WhatsAppAIAssistant {
        constructor() {
            this.aiEndpoint = 'https://second-brain-concept-1.vercel.app/api/ai-assistant/chat';
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
                " title="AI Assistant">
                    🤖
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', buttonHTML);

            // Add hover effect
            const btn = document.getElementById('whatsapp-ai-btn');
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });

            btn.addEventListener('click', () => {
                this.openAIChat();
            });
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
                        ${response}
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button onclick="navigator.clipboard.writeText(\`${response}\`); alert('Disalin!')" style="
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
            `;

            // Remove existing popup
            const existingPopup = document.getElementById('ai-response-popup');
            if (existingPopup) {
                existingPopup.remove();
            }

            document.body.insertAdjacentHTML('beforeend', responseHTML);
        }

        openAIChat() {
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
            `;

            // Remove existing chat interface
            const existingChat = document.getElementById('ai-chat-interface');
            if (existingChat) {
                existingChat.remove();
            }

            document.body.insertAdjacentHTML('beforeend', chatHTML);
            
            // Focus on input
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
                    ">${message}</div>
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
                        ">${response}</div>
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
                        ">❌ Maaf, ada masalah dengan sambungan.</div>
                    </div>
                `;
                messagesDiv.insertAdjacentHTML('beforeend', errorHTML);
            }
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new WhatsAppAIAssistant();
        });
    } else {
        new WhatsAppAIAssistant();
    }
})();
```

---

## 💡 Cara Gunakan

### Method A: Direct Chat
1. Klik butang 🤖 di WhatsApp Web
2. Taip arahan anda dalam chat interface
3. Tekan Enter atau klik "Hantar"

### Method B: WhatsApp Commands
Taip arahan ini terus dalam WhatsApp:
- `@ai tolong buatkan saya daily schedule`
- `!ai berikan saya 5 idea untuk content marketing`
- `/ai bantu saya solve masalah productivity`

---

## 🎯 Contoh Penggunaan

### Planning & Scheduling:
```
@ai tolong buatkan saya daily routine yang produktif
@ai bantu saya plan project untuk minggu depan
@ai berikan saya tips untuk time management
```

### Idea Generation:
```
@ai berikan saya 5 idea untuk business kecil-kecilan
@ai tolong brainstorm content untuk social media
@ai bantu saya develop idea untuk app
```

### Problem Solving:
```
@ai saya ada masalah dengan procrastination, bantu saya
@ai bagaimana nak improve focus semasa bekerja
@ai tips untuk handle stress dan burnout
```

### Learning & Development:
```
@ai berikan saya learning path untuk programming
@ai tolong buatkan study plan untuk saya
@ai tips untuk effective learning
```

---

## 🔧 Troubleshooting

### Jika userscript tak berfungsi:
1. Pastikan Tampermonkey aktif
2. Check script ada di Tampermonkey dashboard
3. Refresh WhatsApp Web page
4. Clear browser cache

### Jika AI Assistant tak respond:
1. Check internet connection
2. Verify WhatsApp Web loading properly
3. Try refresh page
4. Check browser console untuk error

---

## 🎉 Selamat Mencuba!

Anda sekarang boleh gunakan AI Assistant anda terus dalam WhatsApp! 🚀