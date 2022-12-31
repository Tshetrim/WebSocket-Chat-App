# WebSocket-Chat-App
Web-Socket based Chat Application

Demo: https://youtu.be/PAcAujes7hg

There are two servers that spin up:

1. The Express server serves the frontend
2. Websocket server for handling the sockets spins up

The frontend javascript client script that is serveds then makes a jwebsocket connection to the websocket server.

The websocket server and javscript client then communicate to allow for realtime communication, and enable other users to join.

Frontend design credits to: 
  https://codepen.io/clintabrown/pen/kBPpZO
