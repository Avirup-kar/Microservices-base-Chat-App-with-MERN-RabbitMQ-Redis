import { Server } from "socket.io";
import http from "http";
declare const app: import("express-serve-static-core").Express;
declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const userSocketMap: Record<string, string>;
export declare const getRecieverSocketId: (recieverId: string) => string | undefined;
export { app, io, server };
//# sourceMappingURL=socket.d.ts.map