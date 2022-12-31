const net = require("node:net");
const readline = require("readline");

const server_address = "localhost";
const server_port = 8124;

const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let nickname;

const connectionData = function (data) {
    const currentLine = io.line;
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);
    console.log(data.toString());
    process.stdout.write(`[${nickname}]: ${currentLine}`);
};

const connectionEnd = function () {
	console.log("disconnected from server!");
    process.exit()
};

const connectionStart = function () {
	console.log("connected to server!");
    io.question("Choose a Nickname: ", (answer)=>{
        nickname = answer;
        chat();
    });
};

const chat = function() {
    io.question(`[${nickname}]: `, (message)=>{
        if(message === "/exit"){
            client.end(connectionEnd);
            return;
        }

        client.write(`[${nickname}]: ${message}`);
        chat();
    });
}

const client = net.createConnection(server_port, server_address, connectionStart);
client.on("data", connectionData);
client.on("end", connectionEnd);
client.on("error", (error) => console.error(error));


process.on('SIGINT', () => {
    client.end(connectionEnd);
});
  