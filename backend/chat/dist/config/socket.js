import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
export { app, Server, server };
//# sourceMappingURL=socket.js.map