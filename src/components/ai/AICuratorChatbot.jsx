"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/context/CartContext";
import { useAICurator } from "@/lib/context/AICuratorContext";
import ChatMessageMarkdown from "./ChatMessageMarkdown";

export default function AICuratorChatbot() {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const { isOpen, closeCurator, openCurator, initialPrompt, setInitialPrompt } = useAICurator();

  const user = session?.user;
  const userKey = user?.id || user?.email || "guest";
  const userName = user?.name ? user.name.split(" ")[0] : "Art Lover";

  const storageKey = `arthall_ai_curator_sessions_${userKey}`;

  // State for all saved sessions and active session ID
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Theme state synced with root html element
  const [theme, setTheme] = useState("dark");

  // Active chat messages
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedArtIds, setAddedArtIds] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync theme with document.documentElement
  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");

    const observer = new MutationObserver(() => {
      const currentLight = document.documentElement.classList.contains("light");
      setTheme(currentLight ? "light" : "dark");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleCuratorTheme = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const isCurrentlyLight = document.documentElement.classList.contains("light");
    const next = isCurrentlyLight ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  const createInitialWelcomeMessage = () => ({
    id: "welcome-" + Date.now(),
    role: "assistant",
    content: `Hello ${userName}! ✨ I am your **ArtHall AI Curator**.\n\nI can help you discover the perfect artworks for your home, office, or collection based on your **budget**, **color theme**, **room vibe**, or **preferred medium**.\n\nHow can I inspire your gallery today?`,
    recommendedArts: [],
    timestamp: new Date().toISOString(),
  });

  // Load sessions from localStorage on mount or when userKey changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          setMessages(parsed[0].messages || [createInitialWelcomeMessage()]);
          return;
        }
      }
    } catch (e) {
      console.error("Error reading saved curator sessions:", e);
    }

    const initialSessionId = "session-" + Date.now();
    const initialWelcome = createInitialWelcomeMessage();
    const defaultSession = {
      id: initialSessionId,
      title: "New Art Consultation",
      createdAt: new Date().toISOString(),
      messages: [initialWelcome],
    };

    setSessions([defaultSession]);
    setActiveSessionId(initialSessionId);
    setMessages([initialWelcome]);
  }, [userKey]);

  // Save current messages to sessions state and localStorage
  const syncSessions = (updatedMessages, sessionId = activeSessionId) => {
    setSessions((prevSessions) => {
      const targetId = sessionId || prevSessions[0]?.id;
      let existingIndex = prevSessions.findIndex((s) => s.id === targetId);

      let sessionTitle = "Art Consultation";
      const firstUserMsg = updatedMessages.find((m) => m.role === "user");
      if (firstUserMsg && firstUserMsg.content) {
        sessionTitle = firstUserMsg.content.slice(0, 32) + (firstUserMsg.content.length > 32 ? "..." : "");
      }

      let updated;
      if (existingIndex >= 0) {
        updated = [...prevSessions];
        updated[existingIndex] = {
          ...updated[existingIndex],
          title: updated[existingIndex].title === "New Art Consultation" ? sessionTitle : updated[existingIndex].title,
          updatedAt: new Date().toISOString(),
          messages: updatedMessages,
        };
      } else {
        updated = [
          {
            id: targetId,
            title: sessionTitle,
            createdAt: new Date().toISOString(),
            messages: updatedMessages,
          },
          ...prevSessions,
        ];
      }

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.error("Error saving sessions to localStorage:", err);
      }

      return updated;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !showHistory) {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, messages, showHistory]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
      setInitialPrompt(null);
    }
  }, [initialPrompt, isOpen]);

  const quickPrompts = [
    { label: "🔥 Top Trending Paintings", text: "Show me the top trending paintings and sculptures in ArtHall." },
    { label: "💰 Art Under $500", text: "Can you recommend premium artworks under $500?" },
    { label: "🛋️ Living Room Masterpieces", text: "I need an eye-catching artwork for a modern living room." },
    { label: "✨ Best Rated Artworks", text: "What are the highest rated collector artworks available right now?" },
  ];

  const handleNewChat = () => {
    const newSessionId = "session-" + Date.now();
    const initialWelcome = createInitialWelcomeMessage();
    const newSession = {
      id: newSessionId,
      title: "New Art Consultation",
      createdAt: new Date().toISOString(),
      messages: [initialWelcome],
    };

    const nextSessions = [newSession, ...sessions];
    setSessions(nextSessions);
    setActiveSessionId(newSessionId);
    setMessages([initialWelcome]);
    setShowHistory(false);

    try {
      localStorage.setItem(storageKey, JSON.stringify(nextSessions));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSession = (sessionItem) => {
    setActiveSessionId(sessionItem.id);
    setMessages(sessionItem.messages || [createInitialWelcomeMessage()]);
    setShowHistory(false);
  };

  const handleDeleteSession = (sessionIdToDelete, e) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== sessionIdToDelete);
    
    if (filtered.length === 0) {
      handleNewChat();
      return;
    }

    setSessions(filtered);
    try {
      localStorage.setItem(storageKey, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }

    if (activeSessionId === sessionIdToDelete) {
      setActiveSessionId(filtered[0].id);
      setMessages(filtered[0].messages || [createInitialWelcomeMessage()]);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all your AI Curator chat history?")) {
      localStorage.removeItem(storageKey);
      handleNewChat();
    }
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedWithUser = [...messages, userMessage];
    setMessages(updatedWithUser);
    syncSessions(updatedWithUser);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatHistory = updatedWithUser
        .filter((m) => !m.id.startsWith("welcome-"))
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/ai/curator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: chatHistory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get curator response");
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Here are my recommendations for you.",
        recommendedArts: data.recommendedArts || [],
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedWithUser, assistantMessage];
      setMessages(finalMessages);
      syncSessions(finalMessages);
    } catch (err) {
      console.error("AI Curator Error:", err);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having a brief moment of connection delay. Please try asking again in a few seconds!",
        recommendedArts: [],
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updatedWithUser, errorMessage];
      setMessages(finalMessages);
      syncSessions(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (art) => {
    const artId = art._id || art.id;
    setAddedArtIds((prev) => ({ ...prev, [artId]: true }));
    try {
      await addToCart(art);
      setTimeout(() => {
        setAddedArtIds((prev) => ({ ...prev, [artId]: false }));
      }, 2000);
    } catch (e) {
      setAddedArtIds((prev) => ({ ...prev, [artId]: false }));
    }
  };

  if (!session) return null;

  return (
    <>
      {/* --- FLOATING LAUNCHER BUTTON (Bottom Right) --- */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-fadeUp">
          <button
            onClick={() => openCurator()}
            aria-label="Open AI Art Curator"
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-white dark:bg-gradient-to-r dark:from-[#1c1d17] dark:via-[#141510] dark:to-[#0d0e0a] border border-amber-600/30 dark:border-[#D4AF37]/50 shadow-[0_8px_32px_rgba(217,119,6,0.15)] dark:shadow-[0_8px_32px_rgba(212,175,55,0.25)] hover:shadow-xl hover:border-amber-600 dark:hover:border-[#D4AF37] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-[#FFE58F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-600 dark:bg-[#D4AF37]"></span>
            </span>

            <div className="size-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 dark:from-[#D4AF37] dark:to-[#AA7C11] flex items-center justify-center text-white dark:text-black shadow-inner">
              <Icon icon="solar:stars-minimalistic-bold-duotone" className="size-5 animate-spin-slow" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-[#D4AF37]">AI Curator</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#FFE58F] transition-colors">
                Personal Art Advisor
              </span>
            </div>
          </button>
        </div>
      )}

      {/* --- CURATOR CHAT MODAL / DRAWER --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:p-6 pointer-events-none">
          {/* Backdrop for mobile */}
          <div 
            onClick={closeCurator}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:hidden pointer-events-auto transition-opacity"
          />

          <div className="ai-curator-modal relative w-full sm:w-[450px] md:w-[480px] h-[92vh] sm:h-[660px] bg-white dark:bg-[#0E0F0C] border border-slate-200 dark:border-[#3A3C2F] sm:rounded-3xl shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden pointer-events-auto z-10 animate-fadeUp transition-colors duration-200">
            
            {/* --- HEADER --- */}
            <div className="ai-curator-header px-5 py-3.5 border-b border-slate-200 dark:border-[#2A2C22] bg-white/98 dark:bg-[#141510]/95 backdrop-blur-md flex items-center justify-between transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 dark:from-[#AA7C11] dark:via-[#D4AF37] dark:to-[#FFE58F] p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-50 dark:bg-[#0E0F0C] rounded-[14px] flex items-center justify-center">
                    <Icon icon="solar:magic-stick-3-bold-duotone" className="size-5 text-amber-700 dark:text-[#D4AF37]" />
                  </div>
                  <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0E0F0C]"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white tracking-wide">
                      ArtHall AI Curator
                    </h3>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-[#D4AF37]/20 text-amber-800 dark:text-[#FFE58F] border border-amber-300 dark:border-[#D4AF37]/30 font-bold">
                      Gemini 3.6
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">Intelligent Catalog Matchmaker & Stylist</p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-1">
                {/* Theme Toggle Button inside Curator Header */}
                <button
                  onClick={toggleCuratorTheme}
                  title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                  aria-label="Toggle Theme"
                  className="p-2 rounded-xl text-slate-500 hover:text-amber-700 dark:text-gray-400 dark:hover:text-[#FFE58F] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {theme === "dark" ? (
                    <Icon icon="solar:sun-2-bold-duotone" className="size-4 text-[#D4AF37]" />
                  ) : (
                    <Icon icon="solar:moon-bold-duotone" className="size-4 text-[#B45309]" />
                  )}
                </button>

                {/* Toggle Chat History Tab */}
                <button
                  onClick={() => setShowHistory((prev) => !prev)}
                  title={showHistory ? "Back to Chat" : "View Chat History"}
                  aria-label="History"
                  className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                    showHistory
                      ? "bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-black shadow-md"
                      : "text-slate-500 hover:text-amber-700 dark:text-gray-400 dark:hover:text-[#FFE58F] hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon icon={showHistory ? "solar:chat-round-line-bold" : "solar:history-bold-duotone"} className="size-4" />
                  <span className="hidden sm:inline text-[11px]">{showHistory ? "Chat" : "History"}</span>
                </button>

                {/* New Chat Shortcut */}
                <button
                  onClick={handleNewChat}
                  title="Start New Consultation"
                  aria-label="New Chat"
                  className="p-2 rounded-xl text-slate-500 hover:text-amber-700 dark:text-gray-400 dark:hover:text-[#FFE58F] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Icon icon="solar:pen-new-square-bold-duotone" className="size-4" />
                </button>

                {/* Close Drawer */}
                <button
                  onClick={closeCurator}
                  title="Close Curator"
                  aria-label="Close"
                  className="p-2 rounded-xl text-slate-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-[#D4AF37] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Icon icon="solar:close-square-bold" className="size-5" />
                </button>
              </div>
            </div>

            {/* --- VIEW: CHAT HISTORY LIST --- */}
            {showHistory ? (
              <div className="ai-curator-history-view flex-1 overflow-y-auto p-4 flex flex-col bg-[#F8FAFC] dark:bg-[#0A0B08] transition-colors duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2A2C22] mb-3">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:history-bold-duotone" className="size-4 text-amber-700 dark:text-[#D4AF37]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                      Past Consultations ({sessions.length})
                    </span>
                  </div>
                  <button
                    onClick={handleNewChat}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-black hover:brightness-110 transition-all cursor-pointer shadow-xs"
                  >
                    <Icon icon="solar:add-circle-bold" className="size-3.5" />
                    <span>New Chat</span>
                  </button>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                  {sessions.map((sess) => {
                    const isActive = sess.id === activeSessionId;
                    const messageCount = sess.messages ? sess.messages.length : 0;
                    const dateFormatted = sess.createdAt
                      ? new Date(sess.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recent";

                    return (
                      <div
                        key={sess.id}
                        onClick={() => handleSelectSession(sess)}
                        className={`ai-curator-history-item group relative flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isActive
                            ? "active bg-amber-50 dark:bg-[#1C1D15] border-amber-500 dark:border-[#D4AF37] shadow-xs"
                            : "bg-white dark:bg-[#12130F] border-slate-200 dark:border-[#2A2C22] hover:border-amber-400/50 dark:hover:border-[#3A3C2F]"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 pr-2">
                          <div
                            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              isActive
                                ? "bg-amber-100 text-amber-800 dark:bg-[#D4AF37]/20 dark:text-[#FFE58F]"
                                : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-gray-400 group-hover:text-amber-700 dark:group-hover:text-white"
                            }`}
                          >
                            <Icon icon="solar:chat-dots-bold-duotone" className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <h4
                              className={`text-xs font-bold truncate transition-colors ${
                                isActive ? "text-amber-900 dark:text-[#FFE58F]" : "text-slate-800 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-white"
                              }`}
                            >
                              {sess.title || "Art Consultation"}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5 flex items-center gap-2">
                              <span>{dateFormatted}</span>
                              <span>•</span>
                              <span>{messageCount} msgs</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          title="Delete this chat"
                          aria-label="Delete chat"
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {sessions.length > 1 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-[#2A2C22] mt-3 text-center">
                    <button
                      onClick={handleClearAllHistory}
                      className="text-[11px] text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear all conversation history
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* --- VIEW: ACTIVE CHAT CONVERSATION --- */
              <>
                {/* --- CHAT MESSAGES BODY --- */}
                <div className="ai-curator-body flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC] dark:bg-[#0E0F0C] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-[#2A2C22] transition-colors duration-200">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "ai-curator-user-bubble bg-gradient-to-r from-[#D97706] to-[#B45309] dark:from-transparent dark:to-transparent dark:bg-[#D4AF37] text-white dark:text-black font-medium rounded-tr-none shadow-sm"
                            : "ai-curator-assistant-bubble bg-white dark:bg-[#161713] text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-[#2A2C22] rounded-tl-none shadow-xs"
                        }`}
                      >
                        <ChatMessageMarkdown
                          content={msg.content}
                          isUser={msg.role === "user"}
                        />
                      </div>

                      {/* Recommended Artwork Cards */}
                      {msg.recommendedArts && msg.recommendedArts.length > 0 && (
                        <div className="w-full mt-3 grid grid-cols-1 gap-2.5">
                          <p className="text-[11px] font-bold text-amber-800 dark:text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                            <Icon icon="solar:gallery-favourite-bold-duotone" className="size-3.5" />
                            Curator Recommended Pieces ({msg.recommendedArts.length})
                          </p>
                          
                          {msg.recommendedArts.map((art) => {
                            const artId = art._id || art.id;
                            const isAdded = !!addedArtIds[artId];

                            return (
                              <div
                                key={artId}
                                className="ai-curator-art-card flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#12130f] border border-slate-200 dark:border-[#3A3C2F] hover:border-amber-500/60 dark:hover:border-[#D4AF37]/60 transition-all duration-300 group shadow-xs"
                              >
                                <Link href={`/shop/${artId}`} className="relative size-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-black/40">
                                  <img
                                    src={art.image || "/placeholder.jpg"}
                                    alt={art.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </Link>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <Link
                                      href={`/shop/${artId}`}
                                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-amber-700 dark:hover:text-[#D4AF37] truncate transition-colors"
                                    >
                                      {art.title}
                                    </Link>
                                    <span className="text-[11px] font-bold text-amber-700 dark:text-[#FFE58F]">
                                      ${art.price}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                                    By {art.artist || art.artistName || "Artist"} • {art.category}
                                  </p>
                                  <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-[#D4AF37] mt-1 font-semibold">
                                    <Icon icon="solar:star-bold" className="size-2.5" />
                                    <span>{art.rating ? Number(art.rating).toFixed(1) : "5.0"}</span>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-1 shrink-0">
                                  <button
                                    onClick={() => handleAddToCart(art)}
                                    disabled={isAdded}
                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                      isAdded
                                        ? "bg-emerald-600 text-white"
                                        : "bg-amber-100 hover:bg-amber-600 hover:text-white text-amber-900 border border-amber-300 dark:bg-[#25261F] dark:text-[#FFE58F] dark:hover:bg-[#D4AF37] dark:hover:text-black dark:border-[#3A3C2F]"
                                    }`}
                                  >
                                    <Icon icon={isAdded ? "solar:check-circle-bold" : "solar:cart-plus-bold"} className="size-3" />
                                    {isAdded ? "Added" : "Add"}
                                  </button>

                                  <Link
                                    href={`/shop/${artId}`}
                                    className="px-2 py-1 text-center rounded-lg text-[9px] text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                                  >
                                    Details
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 dark:text-gray-500 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <div className="bg-white dark:bg-[#161713] border border-slate-200 dark:border-[#2A2C22] text-slate-600 dark:text-gray-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2 shadow-xs">
                        <span className="flex gap-1">
                          <span className="size-1.5 rounded-full bg-amber-600 dark:bg-[#D4AF37] animate-bounce"></span>
                          <span className="size-1.5 rounded-full bg-amber-600 dark:bg-[#D4AF37] animate-bounce [animation-delay:0.2s]"></span>
                          <span className="size-1.5 rounded-full bg-amber-600 dark:bg-[#D4AF37] animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                        <span>Curator is curating your personalized selection...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* --- QUICK PROMPT CHIPS --- */}
                <div className="ai-curator-chips-bar px-4 py-2 border-t border-slate-200 dark:border-[#22241A] bg-slate-50 dark:bg-[#0E0F0C]/60 flex gap-1.5 overflow-x-auto no-scrollbar scrollbar-none">
                  {quickPrompts.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.text)}
                      disabled={isLoading}
                      className="ai-curator-chip whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium bg-white dark:bg-[#1A1B15] text-slate-700 dark:text-[#D8CCA9] hover:bg-amber-50 dark:hover:bg-[#D4AF37]/20 hover:text-amber-800 dark:hover:text-[#FFE58F] border border-slate-200 dark:border-[#3A3C2F] transition-all shrink-0 cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* --- INPUT FORM --- */}
                <div className="ai-curator-footer p-3 border-t border-slate-200 dark:border-[#2A2C22] bg-white dark:bg-[#141510] transition-colors duration-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="ai-curator-pill flex items-center gap-2 bg-slate-100 dark:bg-[#0E0F0C] border border-slate-300 dark:border-[#3A3C2F] focus-within:border-amber-600 dark:focus-within:border-[#D4AF37] rounded-2xl px-3 py-1.5 transition-all shadow-inner"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about art styles, budget, living room decor..."
                      disabled={isLoading}
                      className="ai-curator-input flex-1 bg-transparent text-sm text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none py-1.5 px-1 border-none shadow-none outline-none"
                    />

                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      aria-label="Send message"
                      className="size-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 dark:from-[#AA7C11] dark:to-[#D4AF37] text-white dark:text-black font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 cursor-pointer shadow-md"
                    >
                      <Icon icon="solar:plain-bold" className="size-4" />
                    </button>
                  </form>
                  <div className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-gray-500">
                    Powered by Google Gemini • Real-time ArtHall live catalog
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
