// WhatsApp AI Assistant using whatsapp.web.js
// More robust and professional implementation

const { Client, LocalAuth, MessageMedia } = require('whatsapp.web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Express server for web interface
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// WhatsApp Client Configuration
class WhatsAppAIClient {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            }
        });

        this.aiEndpoint = 'https://second-brain-concept-1.vercel.app/api/ai-assistant/chat';
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // QR Code generation
        this.client.on('qr', (qr) => {
            console.log('QR Code received, please scan:');
            qrcode.generate(qr, { small: true });
        });

        // Client ready
        this.client.on('ready', () => {
            console.log('✅ WhatsApp AI Assistant is ready!');
            console.log(`📱 Connected as: ${this.client.info.pushname} (${this.client.info.wid.user})`);
        });

        // Authentication failure
        this.client.on('auth_failure', msg => {
            console.error('❌ Authentication failure:', msg);
        });

        // Disconnected
        this.client.on('disconnected', (reason) => {
            console.log('📴 WhatsApp disconnected:', reason);
            console.log('🔄 Restarting in 5 seconds...');
            setTimeout(() => this.initialize(), 5000);
        });

        // Message handler
        this.client.on('message', async (message) => {
            await this.handleMessage(message);
        });

        // Message create handler (for group messages)
        this.client.on('message_create', async (message) => {
            // Skip if it's from the bot itself
            if (message.fromMe) return;
            
            await this.handleMessage(message);
        });
    }

    async handleMessage(message) {
        try {
            const messageText = message.body;
            
            // Check if message contains AI triggers
            if (this.isAIMessage(messageText)) {
                console.log(`🤖 AI request from ${message.from}: ${messageText}`);
                
                // Show typing indicator
                await message.react('🤖');
                
                // Extract command
                const command = this.extractCommand(messageText);
                
                // Get AI response
                const response = await this.getAIResponse(command, message);
                
                // Send response
                await this.sendAIResponse(message, response, command);
                
                // Remove typing indicator
                await message.react('');
            }
        } catch (error) {
            console.error('❌ Error handling message:', error);
            await message.reply('❌ Maaf, ada masalah teknikal. Sila cuba lagi kemudian.');
        }
    }

    isAIMessage(message) {
        if (!message || typeof message !== 'string') return false;
        
        const aiTriggers = ['@ai', '!ai', '/ai', 'ai:', 'assistant:', 'help:', 'bot:'];
        const lowerMessage = message.toLowerCase().trim();
        
        return aiTriggers.some(trigger => 
            lowerMessage.startsWith(trigger) || lowerMessage.includes(' ' + trigger)
        );
    }

    extractCommand(message) {
        if (!message) return '';
        
        return message
            .replace(/@ai|!ai|\/ai|ai:|assistant:|help:|bot:/gi, '')
            .trim();
    }

    async getAIResponse(command, message) {
        try {
            // Get context from message
            const context = await this.getMessageContext(message);
            
            const response = await fetch(this.aiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: command,
                    context: context,
                    userId: message.from,
                    currentSection: 'whatsapp-wwebjs',
                    contextData: {
                        isGroup: message.isGroupMsg,
                        isMedia: message.hasMedia,
                        from: message.from,
                        timestamp: message.timestamp
                    }
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

    async getMessageContext(message) {
        try {
            // Get recent messages for context
            const chat = await message.getChat();
            const messages = await chat.fetchMessages({ limit: 10 });
            
            // Format context
            const context = messages
                .filter(msg => !msg.fromMe)
                .map(msg => ({
                    role: 'user',
                    content: msg.body,
                    timestamp: msg.timestamp
                }))
                .reverse();

            return context;
        } catch (error) {
            console.error('Error getting message context:', error);
            return [];
        }
    }

    async sendAIResponse(originalMessage, response, command) {
        try {
            // Format response with header
            const formattedResponse = `🤖 *AI Assistant - Second Brain*\n\n${response}\n\n💡 *Tips:* Gunakan @ai untuk arahan cepat`;
            
            // Split long messages
            const maxLength = 4096; // WhatsApp message limit
            if (formattedResponse.length <= maxLength) {
                await originalMessage.reply(formattedResponse);
            } else {
                // Split into chunks
                const chunks = this.splitMessage(formattedResponse, maxLength);
                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    const prefix = chunks.length > 1 ? `📄 *Bahagian ${i + 1}/${chunks.length}*\n\n` : '';
                    await originalMessage.reply(prefix + chunk);
                    
                    // Add delay between messages to avoid spam detection
                    if (i < chunks.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        } catch (error) {
            console.error('Error sending AI response:', error);
            await originalMessage.reply('❌ Maaf, gagal menghantar response. Sila cuba lagi.');
        }
    }

    splitMessage(message, maxLength) {
        const chunks = [];
        let currentChunk = '';
        
        const sentences = message.split('\n');
        
        for (const sentence of sentences) {
            if (currentChunk.length + sentence.length + 1 <= maxLength) {
                currentChunk += (currentChunk ? '\n' : '') + sentence;
            } else {
                if (currentChunk) {
                    chunks.push(currentChunk);
                }
                currentChunk = sentence;
            }
        }
        
        if (currentChunk) {
            chunks.push(currentChunk);
        }
        
        return chunks;
    }

    async initialize() {
        try {
            console.log('🚀 Initializing WhatsApp AI Assistant...');
            await this.client.initialize();
        } catch (error) {
            console.error('❌ Failed to initialize WhatsApp client:', error);
            console.log('🔄 Retrying in 10 seconds...');
            setTimeout(() => this.initialize(), 10000);
        }
    }

    async getStatus() {
        return {
            ready: this.client.info !== undefined,
            connected: this.client.pupBrowser !== undefined,
            user: this.client.info ? this.client.info.pushname : null,
            number: this.client.info ? this.client.info.wid.user : null
        };
    }
}

// Initialize WhatsApp client
const waClient = new WhatsAppAIClient();

// Web Interface Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'whatsapp-ai-dashboard.html'));
});

app.get('/status', async (req, res) => {
    try {
        const status = await waClient.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/send-message', async (req, res) => {
    try {
        const { number, message } = req.body;
        
        if (!number || !message) {
            return res.status(400).json({ error: 'Number and message are required' });
        }

        // Format number (add @c.us suffix)
        const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        
        await waClient.client.sendMessage(formattedNumber, message);
        
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/ai-query', async (req, res) => {
    try {
        const { message, context = 'web-interface' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await fetch(waClient.aiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: context,
                userId: 'web-user',
                currentSection: 'web-interface'
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('AI query error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start Express server
app.listen(PORT, () => {
    console.log(`🌐 Web interface running at http://localhost:${PORT}`);
});

// Initialize WhatsApp client
waClient.initialize();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down gracefully...');
    try {
        await waClient.client.destroy();
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('🛑 Shutting down gracefully...');
    try {
        await waClient.client.destroy();
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

console.log('🚀 WhatsApp AI Assistant with whatsapp.web.js starting...');
console.log('📱 Please scan the QR code when it appears');
console.log('🌐 Web interface: http://localhost:3002');