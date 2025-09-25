// WhatsApp AI Assistant Bridge
// This script connects WhatsApp Web with your AI Assistant

class WhatsAppAIBridge {
    constructor() {
        this.aiEndpoint = 'https://second-brain-concept-1.vercel.app/api/ai-assistant/chat';
        this.initializeWhatsAppIntegration();
    }

    initializeWhatsAppIntegration() {
        // Wait for WhatsApp Web to load
        const checkWhatsAppLoaded = setInterval(() => {
            if (document.querySelector('#app') && document.querySelector('.app-wrapper-web')) {
                clearInterval(checkWhatsAppLoaded);
                this.setupWhatsAppInterface();
            }
        }, 1000);
    }

    setupWhatsAppInterface() {
        // Add AI Assistant button to WhatsApp Web
        this.addAIAssistantButton();
        this.setupMessageInterceptor();
        this.setupAIResponseHandler();
    }

    addAIAssistantButton() {
        const buttonHTML = `
            <div id="ai-assistant-btn" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: linear-gradient(45deg, #25D366, #128C7E);
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
            ">🤖</div>
        `;

        document.body.insertAdjacentHTML('beforeend', buttonHTML);

        // Add click handler
        document.getElementById('ai-assistant-btn').addEventListener('click', () => {
            this.openAIAssistant();
        });
    }

    setupMessageInterceptor() {
        // Intercept messages sent to AI Assistant
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
                const messageElement = node.querySelector('[data-pre-plain-text]');
                if (messageElement) {
                    const messageText = messageElement.textContent || messageElement.innerText;
                    if (this.isAIMessage(messageText)) {
                        this.processAIMessage(messageText);
                    }
                }
            }
        });
    }

    isAIMessage(message) {
        // Check if message is directed to AI Assistant
        const aiKeywords = ['@ai', '!ai', '/ai', 'ai:', 'assistant'];
        return aiKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );
    }

    async processAIMessage(message) {
        try {
            // Extract the actual command (remove AI keywords)
            const command = this.extractCommand(message);
            
            // Send to your AI Assistant
            const response = await this.callAIAssistant(command);
            
            // Send response back to WhatsApp
            this.sendAIResponse(response);
        } catch (error) {
            console.error('Error processing AI message:', error);
            this.sendAIResponse('Maaf, ada masalah dengan AI Assistant. Sila cuba lagi.');
        }
    }

    extractCommand(message) {
        // Remove AI keywords and clean the message
        return message
            .replace(/@ai|!ai|\/ai|ai:/gi, '')
            .trim();
    }

    async callAIAssistant(command) {
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

        if (!response.ok) {
            throw new Error('AI Assistant request failed');
        }

        const data = await response.json();
        return data.response || data.message || 'Tiada respons dari AI.';
    }

    sendAIResponse(response) {
        // Create AI response interface in WhatsApp
        const responseHTML = `
            <div class="ai-response" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #25D366;
                border-radius: 10px;
                padding: 20px;
                max-width: 400px;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #128C7E;">🤖 AI Assistant</h3>
                    <button onclick="this.closest('.ai-response').remove()" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                <div style="color: #333; line-height: 1.5;">${response}</div>
                <div style="margin-top: 15px; text-align: right;">
                    <button onclick="this.closest('.ai-response').remove(); navigator.clipboard.writeText(\`${response}\`);" style="
                        background: #25D366;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-right: 10px;
                    ">Copy</button>
                    <button onclick="this.closest('.ai-response').remove()" style="
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Close</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', responseHTML);
    }

    openAIAssistant() {
        const interfaceHTML = `
            <div class="ai-assistant-interface" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #25D366;
                border-radius: 15px;
                padding: 25px;
                width: 500px;
                max-height: 600px;
                z-index: 10000;
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #128C7E;">🤖 AI Assistant</h3>
                    <button onclick="this.closest('.ai-assistant-interface').remove()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                
                <div id="ai-chat-history" style="
                    height: 300px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    background: #f8f9fa;
                ">
                    <div style="color: #666; text-align: center; padding: 20px;">
                        Saya AI Assistant anda. Boleh bantu apa hari ini?
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="ai-input" placeholder="Taip arahan anda..." style="
                        flex: 1;
                        padding: 12px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 14px;
                    ">
                    <button onclick="sendAIMessage()" style="
                        background: #25D366;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Hantar</button>
                </div>
                
                <div style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">
                    💡 Tip: Anda juga boleh taip "@ai" di WhatsApp untuk arahan cepat
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', interfaceHTML);
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('ai-input').focus();
        }, 100);
    }
}

// Auto-initialize when WhatsApp Web loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WhatsAppAIBridge();
    });
} else {
    new WhatsAppAIBridge();
}

// Global function for AI interface
window.sendAIMessage = async function() {
    const input = document.getElementById('ai-input');
    const chatHistory = document.getElementById('ai-chat-history');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    const userMessageHTML = `
        <div style="margin-bottom: 15px; text-align: right;">
            <div style="
                background: #25D366;
                color: white;
                padding: 10px 15px;
                border-radius: 18px;
                display: inline-block;
                max-width: 70%;
            ">${message}</div>
        </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', userMessageHTML);
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    const typingHTML = `
        <div id="ai-typing" style="margin-bottom: 15px;">
            <div style="
                background: #e9ecef;
                color: #666;
                padding: 10px 15px;
                border-radius: 18px;
                display: inline-block;
                max-width: 70%;
            ">🤖 AI sedang menaip...</div>
        </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', typingHTML);
    
    try {
        // Call AI Assistant
        const response = await fetch('https://second-brain-concept-1.vercel.app/api/ai-assistant/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: 'whatsapp',
                userId: 'whatsapp-user'
            })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        const typingElement = document.getElementById('ai-typing');
        if (typingElement) {
            typingElement.remove();
        }
        
        // Add AI response
        const aiMessageHTML = `
            <div style="margin-bottom: 15px;">
                <div style="
                    background: #f1f3f4;
                    color: #333;
                    padding: 10px 15px;
                    border-radius: 18px;
                    display: inline-block;
                    max-width: 70%;
                ">${data.response || data.message || 'Maaf, saya tidak faham.'}</div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', aiMessageHTML);
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
    } catch (error) {
        // Remove typing indicator
        const typingElement = document.getElementById('ai-typing');
        if (typingElement) {
            typingElement.remove();
        }
        
        // Show error message
        const errorMessageHTML = `
            <div style="margin-bottom: 15px;">
                <div style="
                    background: #f8d7da;
                    color: #721c24;
                    padding: 10px 15px;
                    border-radius: 18px;
                    display: inline-block;
                    max-width: 70%;
                ">❌ Maaf, ada masalah dengan sambungan.</div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', errorMessageHTML);
        
        console.error('AI Assistant error:', error);
    }
};

console.log('🤖 WhatsApp AI Assistant Bridge loaded!');