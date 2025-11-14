import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../_Components/AdminLayout";
import { io, Socket } from "socket.io-client";
import { getChatHistory } from "../../../api/chat";

type AdminUser = { user_id: string | number; username: string; email?: string };

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

type Msg = { sender: string | number; text: string; message_id?: number; created_at?: string };

export default function AdminChat() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  // load users directly (attach access token)
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${SOCKET_URL}/api/v1/admin/users`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (res.status === 403) {
        setError("Forbidden (403): you are not authorized to access this resource.");
        setUsers([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err: any) {
      setError(err?.message || String(err));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
   
    socketRef.current = io(SOCKET_URL, { transports: ["polling", "websocket"], auth: { token }, withCredentials: true });
    socketRef.current.on("connect_error", (err: any) => {
      console.error("socket connect_error", err);

      try {
        console.error('connect_error message', err?.message, 'data', err?.data);
      } catch (e) {
       
      }
    });
    socketRef.current.on("private_message", (msg: any) => {
     
      const senderId = msg.sender_id ?? msg.sender ?? msg.sender_username;
      const senderUsername = msg.sender_username ?? (typeof msg.sender === "string" ? msg.sender : undefined);

      
      if (
        selectedUser &&
        (String(selectedUser.user_id) === String(senderId) || String(selectedUser.username) === String(senderUsername))
      ) {
        const displaySender = senderUsername ?? senderId ?? msg.sender;
        setMessages((m) => [...m, { sender: displaySender, text: msg.content || msg.text, created_at: msg.created_at }]);
      } else {
      
        loadUsers();
      }
    });

    // initial load
    loadUsers();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
    
  }, [selectedUser]);


  const selectUser = async (u: AdminUser) => {
    setSelectedUser(u);
    try {
      const hist = await getChatHistory(u.user_id);
     
      setMessages(
        (hist || []).map((m: any) => ({ sender: m.sender_id || m.sender, text: m.content || m.text, created_at: m.created_at }))
      );
    } catch (err) {
      setMessages([]);
    }
  };

  const sendMessage = (text: string) => {
    if (!selectedUser || !text || !socketRef.current) return;
    const payload = { sender: "admin", receiver: selectedUser.user_id, content: text, is_from_admin: true };
    socketRef.current.emit("private_message", payload);
    setMessages((m) => [...m, { sender: "admin", text }]);
  };

  return (
    <AdminLayout title="Chat với khách hàng">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="text-sm font-semibold">Danh sách khách hàng</div>
          <ul className="mt-2 space-y-2">
            {loading && <li className="text-xs text-neutral-500">Đang tải...</li>}
            {!loading && (!users || users.length === 0) && <li className="text-xs text-neutral-500">Không có dữ liệu</li>}
            {users?.map((u: AdminUser) => (
              <li key={u.user_id}>
                <button
                  onClick={() => selectUser(u)}
                  className={[
                    "w-full text-left rounded-md px-2 py-2",
                    selectedUser?.user_id === u.user_id ? "bg-black text-white" : "hover:bg-neutral-50",
                  ].join(" ")}
                >
                  <div className="font-semibold">{u.username}</div>
                  <div className="text-xs text-neutral-500">{u.email}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3 rounded-xl border border-neutral-200 bg-white p-4 flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold">{selectedUser ? selectedUser.username : "Chọn khách hàng"}</h3>
              {selectedUser && <p className="text-xs text-neutral-500">ID: {selectedUser.user_id}</p>}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-2">
            <ul className="space-y-3">
              {messages.map((m, i) => (
                <li key={i} className={String(m.sender) === "admin" ? "text-right" : "text-left"}>
                  <div className="inline-block max-w-[75%] rounded-lg bg-gray-100 px-3 py-2 text-sm">
                    <div className="font-semibold text-xs text-neutral-600">{m.sender}</div>
                    <div>{m.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 flex gap-2">
            <input className="flex-1 rounded border px-2 py-2" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (sendMessage(input), setInput(""))} />
            <button className="rounded bg-black px-4 py-2 text-white" onClick={() => { sendMessage(input); setInput(""); }}>
              Gửi
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

