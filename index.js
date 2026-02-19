const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let lastFrame = "";

// الموبايل هيبعت الصورة هنا
app.use(express.raw({ type: 'image/jpeg', limit: '10mb' }));
app.post('/push', (req, res) => {
    lastFrame = req.body.toString('base64');
    io.emit('frame', lastFrame); // يوزعها فوراً لكل اللي فاتحين
    res.send('ok');
});

// الناس هتشوف البث هنا
app.get('/', (req, res) => {
    res.send("<html><body><img id='v' style='width:100%'><script src='/socket.io/socket.io.js'></script><script>const s=io(); s.on('frame',f=>{document.getElementById('v').src='data:image/jpeg;base64,'+f;});</script></body></html>");
});

http.listen(process.env.PORT || 3000);
