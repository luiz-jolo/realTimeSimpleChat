const express = require('express');
const path = require('path');


const app = express();
/* informar a porta para o websocket e defininfo o protocolo http */
const server = require('http').createServer(app);
/* defininfo o protocolo wss */
const io = require('socket.io')(server);
/* local da pasta que o node vai executar os arquivos front*/
app.use(express.static(path.join(__dirname, 'public')));
/* para o node enxergar as views html */
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
/* rota */
app.use('/', (req, res) => {
	res.render('index.html');
})

/*armazenando as mensagens em array, sem ser em banco*/
let messages = [];

io.on('connection', socket => {
	console.log(`Socket Conectado: ${socket.id}`);

	/*ultimo passo, armazenando o array para nao perder dados ao atualizar a página*/
	socket.emit('previousMessages', messages);

	socket.on('sendMessage', data => {
		messages.push(data);
		socket.broadcast.emit('receivedMessage', data);
	})
})
/* ouvir a porta x */
server.listen(3000);

