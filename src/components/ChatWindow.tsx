"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuthUser } from "@/hooks/useAuthUser";
import botReply, { smartBotReply } from "@/services/bot";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

type ChatMessage = {
  id?: string;
  senderId: string;
  senderType: "user" | "bot";
  text: string;
  createdAt: any;
};

export default function ChatWindow() {
  const { user, initializing } = useAuthUser();
  const uid = user?.uid || "";
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sign, setSign] = useState<string>("Aries");
  const [natalISO, setNatalISO] = useState<string | undefined>(undefined);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!uid) return;
    (async () => {
      const rooms = collection(db, "chats");
      const existing = await getDocs(
        query(rooms, where("participants", "array-contains", uid))
      );
      if (!existing.empty) {
        setRoomId(existing.docs[0].id);
        return;
      }
      const created = await addDoc(rooms, {
        participants: [uid],
        createdAt: serverTimestamp(),
      });
      setRoomId(created.id);
    })();
  }, [uid]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!uid) return;
      const profile = await getDoc(doc(db, "users", uid));
      if (alive && profile.exists()) {
        const data = profile.data();
        if (data?.zodiacSign) setSign(data.zodiacSign);
        if (data?.dob && data?.time) {
          setNatalISO(`${data.dob}T${data.time}:00`);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [uid]);

  useEffect(() => {
    if (!roomId) return;
    const msgsCol = collection(db, "chats", roomId, "messages");
    const q = query(msgsCol, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: ChatMessage[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
      setMessages(list);
      requestAnimationFrame(() => {
        viewportRef.current?.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    });
    return () => unsub();
  }, [roomId]);

  const sendMsg = async () => {
    if (!text.trim() || !uid || !roomId) return;
    const msgsCol = collection(db, "chats", roomId, "messages");
    const content = text.trim();
    setText("");

    await addDoc(msgsCol, {
      senderId: uid,
      senderType: "user",
      text: content,
      createdAt: serverTimestamp(),
    });

    const reply = natalISO
      ? await smartBotReply(content, natalISO)
      : botReply(content, sign);

    setTimeout(async () => {
      await addDoc(msgsCol, {
        senderId: uid,
        senderType: "bot",
        text: reply,
        createdAt: serverTimestamp(),
      });
    }, 900);
  };

  if (initializing || !roomId) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-neutral-400">
        Loading chat…
      </div>
    );
  }

  return (
    <div className="flex h-[75vh] max-h-[720px] w-full max-w-3xl flex-col rounded-3xl border border-neutral-800 bg-neutral-900 shadow-xl">
      <div
        ref={viewportRef}
        data-lenis-prevent
        className=" scrollbar-hide flex-1 space-y-3 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <div className="mt-20 text-center text-sm text-neutral-500">
            No messages yet. Say hi! 👋
          </div>
        )}
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                m.senderType === "user"
                  ? "ml-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "mr-auto bg-neutral-800 text-neutral-100"
              }`}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="border-t border-neutral-800 bg-neutral-900/80 p-4 backdrop-blur">
        <div className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2.5 shadow-inner">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMsg();
            }}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-400 focus:outline-none"
            placeholder="Ask about love, career, or health…"
          />
          <motion.button
            onClick={sendMsg}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:opacity-90"
          >
            <Send className="h-4 w-4" />
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
}
