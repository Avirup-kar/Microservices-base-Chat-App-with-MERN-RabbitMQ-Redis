import { Server } from "socket.io";
import http from "http";
declare const app: import("express-serve-static-core").Express;
declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export { app, Server, server };
//# sourceMappingURL=socket.d.ts.map