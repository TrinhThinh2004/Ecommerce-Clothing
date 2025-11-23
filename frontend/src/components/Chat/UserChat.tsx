import React, { useEffect, useRef, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { MessageSquare, X } from "lucide-react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

type Msg = { sender: string | number; text: string; message_id?: number; created_at?: string; is_from_admin?: boolean };

type Props = {
  onOpenChange?: (open: boolean) => void;
  rightOffset?: number | string;
  bottomOffset?: number | string;
};

export default function UserChat({ onOpenChange, rightOffset = 24, bottomOffset = 96 }: Props) {
  const [username, setUsername] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [receiver, setReceiver] = useState<string | number>("admin");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (connected && username) {
      const token = localStorage.getItem('accessToken');
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

      socketRef.current.on("connect_error", (err: any) => {
        console.error('socket connect_error', err);
      });

      socketRef.current.emit("register", username);

      socketRef.current.on("private_message", (msg: any) => {
        setMessages((prev) => [...prev, { sender: msg.sender, text: msg.content, message_id: msg.message_id, created_at: msg.created_at, is_from_admin: msg.is_from_admin }]);
      });

      return () => {
        socketRef.current?.disconnect();
        socketRef.current = null;
      };
    }
  }, [connected, username]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        const name = (u && (u.username || u.name || u.email)) || "";
        if (name) {
          setUsername(String(name));
          setConnected(true);
        }
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleRegister = () => {
    if (!username) return;
    setConnected(true);
  };

  const sendPrivateMessage = () => {
    if (!message || !socketRef.current) return;
    // send to admin; server will handle routing and saving
    const payload = { receiver: 'admin', content: message };
    socketRef.current.emit("private_message", payload);
    setMessages((prev) => [...prev, { sender: username, text: message }]);
    setMessage("");
  };

  const triggerStyle = useMemo<React.CSSProperties>(() => {
    const right = typeof rightOffset === "number" ? `${rightOffset}px` : rightOffset;
    const bottom = typeof bottomOffset === "number" ? `${bottomOffset}px` : bottomOffset;
    return {
      position: "fixed",
      right: `calc(${right} + env(safe-area-inset-right))`,
      bottom: `calc(${bottom} + env(safe-area-inset-bottom))`,
      zIndex: 60,
    };
  }, [rightOffset, bottomOffset]);

  return (
    <div style={triggerStyle} className="z-50">
      <button
        className="mb-2 h-14 w-14 grid place-content-center rounded-full bg-black text-white shadow-lg"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          onOpenChange?.(next);
        }}
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="w-80 max-w-full rounded-xl bg-white shadow-xl">
          {!connected ? (
            <div className="p-4">
              <div className="mb-2 text-sm font-semibold">Chat với Shop</div>
              <input
                className="mb-2 w-full rounded border px-2 py-1"
                placeholder="Nhập tên của bạn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="flex gap-2">
                <button className="flex-1 rounded bg-blue-600 py-1 text-white" onClick={handleRegister}>
                  Kết nối
                </button>
                <button className="flex-1 rounded border py-1" onClick={() => { setIsOpen(false); onOpenChange?.(false); }}>
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-96 flex-col">
              <div className="flex-1 overflow-auto p-3">
                <ul className="space-y-2">
                  {messages.map((m, i) => (
                    <li key={i} className={m.sender === username ? "text-right" : "text-left"}>
                      <div className="inline-block max-w-[75%] rounded-lg bg-gray-100 px-3 py-2 text-sm">
                        <div className="font-semibold text-xs text-neutral-600">{m.sender}</div>
                        <div>{m.text}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t p-3">
                {/* <div className="mb-2 text-xs text-neutral-500">Gửi đến</div> */}
                {/* <input className="mb-2 w-full rounded border px-2 py-1" value={String(receiver)} onChange={(e) => setReceiver(e.target.value)} /> */}
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded border px-2 py-1"
                    placeholder="Nhập tin nhắn"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendPrivateMessage()}
                  />
                  <button className="rounded bg-blue-600 px-3 py-1 text-white" onClick={sendPrivateMessage}>
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
