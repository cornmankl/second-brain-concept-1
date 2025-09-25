const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// AI Assistant endpoint (proxy to your Vercel app)
app.post('/api/ai-assistant/chat', async (req, res) => {
    try {
        const { message, context, userId } = req.body;
        
        // Call your Vercel AI Assistant
        const response = await fetch('https://second-brain-concept-1.vercel.app/api/ai-assistant/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message || '',
                context: context || 'whatsapp',
                userId: userId || 'whatsapp-user'
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('AI Assistant error:', error);
        res.status(500).json({
            error: 'AI Assistant service unavailable',
            message: 'Maaf, AI Assistant tidak dapat dihubungi sekarang.'
        });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve main HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🤖 WhatsApp AI Server running at http://localhost:${PORT}`);
    console.log(`📱 Open this URL in your phone's browser to use with WhatsApp`);
});