import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export interface SocketEvent {
  id: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<SocketEvent[]>([]);

  const addEvent = useCallback((event: string, data: Record<string, unknown>) => {
    setEvents((prev) => [
      {
        id: crypto.randomUUID(),
        event,
        data,
        timestamp: new Date(),
      },
      ...prev,
    ].slice(0, 50));
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("transaction:created", (data) => addEvent("transaction:created", data));
    socket.on("balance:updated", (data) => addEvent("balance:updated", data));
    socket.on("transaction:failed", (data) => addEvent("transaction:failed", data));

    return () => {
      socket.disconnect();
    };
  }, [addEvent]);

  return { connected, events, socket: socketRef.current };
}
