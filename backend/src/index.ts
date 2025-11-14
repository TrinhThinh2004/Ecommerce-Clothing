import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import path from "path";
import http from 'http';
import { Server as IOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User';
import Message from './models/Message';
import { testConnection } from "./config/database";
import productsRouter from "./routes/products";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import categoryRoutes from "./routes/categorys";
import orderItemRoutes from "./routes/orderItem";
import cart from "./routes/cart";
import orderRoutes from "./routes/order";
import paymentRoutes from "./routes/payment"
import chatRoutes from "./routes/chat";
dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
  res.send("Hello backend with CORS + TS + MySQL!");
});


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/admin', adminRouter);
app.use("/api/v1/categorys", categoryRoutes);
app.use("/api/v1/cart", cart);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/order-items", orderItemRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/v1/chat", chatRoutes);



const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const raw = socket.handshake.auth && socket.handshake.auth.token;
    if (!raw) {
      // allow guest/anonymous connection; client should emit "register" with username after connect
      socket.data.guest = true;
      return next();
    }

    const token = String(raw).replace(/^Bearer\s+/i, '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');

    const userId = (decoded as any).user_id;
    const user = await User.findByPk(userId);
    if (!user) return next(new Error('Authentication error: user not found'));
    socket.data.user = user;
    next();
  } catch (err) {
    // invalid token -> reject
    console.warn('Socket auth error', err);
    return next(new Error('Authentication error'));
  }
});


const userSockets: Map<number, Set<string>> = new Map();
const usernameSockets: Map<string, Set<string>> = new Map();
const adminSockets: Set<string> = new Set();

const addToMap = (map: Map<any, Set<string>>, key: any, sid: string) => {
  const s = map.get(key) || new Set<string>();
  s.add(sid);
  map.set(key, s);
};

const removeFromMap = (map: Map<any, Set<string>>, key: any, sid: string) => {
  const s = map.get(key);
  if (!s) return;
  s.delete(sid);
  if (s.size === 0) map.delete(key);
};

io.on('connection', (socket) => {
  // console.log('Socket connected', socket.id, 'user', socket.data.user?.user_id, 'guest', socket.data.guest);

  if (socket.data.user) {
    const uid = Number(socket.data.user.user_id);
    addToMap(userSockets, uid, socket.id);
    if ((socket.data.user as any).role === 'admin') {
      adminSockets.add(socket.id);
      // console.log('Admin socket registered', socket.id);
    }
  }

  socket.on('register', (username: string) => {
    socket.data.username = username;
    addToMap(usernameSockets, username, socket.id);
    // console.log('Socket registered username', username, 'id', socket.id);
  });

  // private messaging routing
  socket.on('private_message', async (payload: any) => {
    // console.log('private_message received', payload);
    let sender_id = socket.data?.user?.user_id ?? null;
    const sender_username = socket.data?.user?.username ?? socket.data?.username ?? null;
    const receiver = payload.receiver;

    // if sender_id is null but we have username, try to find user_id from DB
    if (!sender_id && sender_username) {
      try {
        const user = await User.findOne({ where: { username: sender_username } });
        if (user) sender_id = Number(user.user_id);
      } catch (err) {
        console.error('Error finding user by username:', err);
      }
    }

    const out = { ...payload, sender_id, sender_username, created_at: new Date().toISOString() };

    // save to database
    try {
      let receiver_id: number | null = null;

      // determine receiver_id from receiver field
      if (receiver === 'admin' || receiver === 'Admin') {
        // admin message: find an admin user by role
        const adminUser = await User.findOne({ where: { role: 'admin' } });
        receiver_id = adminUser ? Number(adminUser.user_id) : null;
      } else {
        receiver_id = Number(receiver);
      }

      // save message to DB
      if (sender_id && receiver_id) {
        await Message.create({
          sender_id: Number(sender_id),
          receiver_id,
          content: payload.content,
          is_from_admin: payload.is_from_admin || false,
        });
        // console.log(`Message saved: sender=${sender_id}, receiver=${receiver_id}, content=${payload.content.substring(0, 50)}`);
      } else {
        console.warn(`Cannot save message: sender_id=${sender_id}, receiver_id=${receiver_id}`);
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }

    // route message to receiver(s)
    if (receiver === 'admin' || receiver === 'Admin') {
      // console.log('Routing to admin sockets:', Array.from(adminSockets));
      adminSockets.forEach((sid) => {
        io.to(sid).emit('private_message', out);
      });
      return;
    }

    // if receiver is numeric (user id)
    const recvNum = Number(receiver);
    if (!Number.isNaN(recvNum) && userSockets.has(recvNum)) {
      const set = userSockets.get(recvNum)!;
      console.log('Routing to user', recvNum, 'sockets:', Array.from(set));
      set.forEach((sid) => io.to(sid).emit('private_message', out));
      return;
    }

    if (typeof receiver === 'string' && usernameSockets.has(receiver)) {
      const set = usernameSockets.get(receiver)!;
      console.log('Routing to username', receiver, 'sockets:', Array.from(set));
      set.forEach((sid) => io.to(sid).emit('private_message', out));
      return;
    }


    // console.log('No target found, broadcasting to all');
    socket.broadcast.emit('private_message', out);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected', socket.id, reason);
    // cleanup mappings
    if (socket.data?.user) {
      const uid = Number(socket.data.user.user_id);
      removeFromMap(userSockets, uid, socket.id);
      if ((socket.data.user as any).role === 'admin') {
        adminSockets.delete(socket.id);
      }
    }
    if (socket.data?.username) {
      removeFromMap(usernameSockets, socket.data.username, socket.id);
    }
  });
});

server.listen(PORT, async () => {
  console.log(`Server + Socket.IO running on http://localhost:${PORT}`);
  await testConnection();
});
