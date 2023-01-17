# WebSocket-Chat-App
Web-Socket based Chat Application

Demo: https://youtu.be/tW7InYyD2HQ

There are two servers that spin up:

1. The Express server serves the frontend
2. Websocket server for handling the sockets spins up

The frontend javascript client script that is served by the backend, which then makes a websocket connection to the websocket server.

The websocket server and javscript client then communicate to allow for realtime communication, and enable other users to join.

Frontend design credits to: 
  https://codepen.io/clintabrown/pen/kBPpZO
