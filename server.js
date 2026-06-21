// server.js
// 🚀 السيرفر المركزي الكامل والموحد للبث اللانهائي - يعمل على Node.js
const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. واجهة التحكم المستمرة (Dashboard) للمتصفح
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Apex Live Stream Engine</title>
        <style>
            body { background-color: #0b0f19; color: #fff; font-family: sans-serif; text-align: center; margin: 0; padding: 20px; }
            .status-bar { background: #151d30; padding: 12px; border-radius: 50px; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 0 15px rgba(0,255,128,0.2); margin-bottom: 30px; }
            .dot { width: 12px; height: 12px; background-color: #00ff80; border-radius: 50%; display: inline-block; animation: pulse 1.5s infinite; }
            .canvas-container { max-width: 360px; margin: 0 auto; background: #000; border: 2px solid #1e293b; border-radius: 12px; min-height: 640px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            img { width: 100%; height: auto; display: none; border-radius: 10px; }
            @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        </style>
    </head>
    <body>
        <div class="status-bar">
            <span class="dot" id="statusDot"></span>
            <span id="statusText">جاري الاتصال بالسيرفر المركزي... ⚡</span>
        </div>
        
        <div class="canvas-container">
            <div id="loader">🔌 في انتظار تشغيل تطبيق الأندرويد وضخ الفريمات...</div>
            <img id="liveStream" alt="Live Stream">
        </div>

        <script>
            // تحديد البروتوكول تلقائياً سواء كان محلي أو مشفر سحابي
            const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
            const wsUrl = protocol + window.location.host + '/gaming-ws';
            const ws = new WebSocket(wsUrl);
            
            const img = document.getElementById('liveStream');
            const loader = document.getElementById('loader');
            const statusText = document.getElementById('statusText');

            ws.onopen = () => {
                statusText.innerText = "المتصفح متصل بالسيرفر وجاهز للاستقبال! 🟢";
            };

            ws.onmessage = async (event) => {
                let data = event.data;
                
                // إذا كانت البيانات قادمة كـ Blob نقوم بتحويلها لنص
                if (data instanceof Blob) {
                    data = await data.text();
                }

                if (data.includes(':IMG:')) {
                    const base64Data = data.split(':IMG:')[1];
                    img.src = 'data:image/jpeg;base64,' + base64Data;
                    img.style.display = 'block';
                    loader.style.display = 'none';
                }
            };

            ws.onclose = () => {
                statusText.innerText = "❌ انقطع الاتصال بالسيرفر الرئيسي!";
                document.getElementById('statusDot').style.background = '#ff4a4a';
            };
        </script>
    </body>
    </html>
    `);
});

// 2. تشغيل سيرفر الـ HTTP
const server = app.listen(PORT, () => {
    console.log(`🚀 المحرك يعمل بكفاءة على بورت: ${PORT}`);
});

// 3. بناء سيرفر الـ WebSockets الحقيقي (الموحد للجميع)
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url, `http://\${request.headers.host}`).pathname;

    if (pathname === '/gaming-ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

wss.on('connection', (ws) => {
    console.log('🔌 جهاز جديد دخل النفق المركزي (أندرويد أو متصفح)!');

    ws.on('message', (message) => {
        // 🔥 المعجزة هنا: البث العام (Broadcast)
        // أي فريم يوصل من الأندرويد، السيرفر يلف على كل المتصلين (المتصفحات) ويبعتهولهم فوراً!
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('❌ خرج جهاز من النفق.');
    });
});
