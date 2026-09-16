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

  // State for all saved sessions and the active session ID
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Active chat messages
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedArtIds, setAddedArtIds] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

    // Default new session if none exists
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

      // Generate a title based on the first user query if not already custom
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

  // Auto-scroll to bottom
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

  // Handle external initial prompt
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
      setInitialPrompt(null);
    }
  }, [initialPrompt, isOpen]);

  // Quick prompt suggestions
  const quickPrompts = [
    { label: "🔥 Top Trending Paintings", text: "Show me the top trending paintings and sculptures in ArtHall." },
    { label: "💰 Art Under $500", text: "Can you recommend premium artworks under $500?" },
    { label: "🛋️ Living Room Masterpieces", text: "I need an eye-catching artwork for a modern living room." },
    { label: "✨ Best Rated Artworks", text: "What are the highest rated collector artworks available right now?" },
  ];

  // Start a new chat session
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

  // Switch to a past session
  const handleSelectSession = (sessionItem) => {
    setActiveSessionId(sessionItem.id);
    setMessages(sessionItem.messages || [createInitialWelcomeMessage()]);
    setShowHistory(false);
  };

  // Delete a specific session
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

  // Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all your AI Curator chat history?")) {
      localStorage.removeItem(storageKey);
      handleNewChat();
    }
  };

  // Send message
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
      // Build conversation history for AI context
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

  // Only render if user is logged in
  if (!session) return null;

  return (
    <>
      {/* --- FLOATING LAUNCHER BUTTON (Bottom Right) --- */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-fadeUp">
          <button
            onClick={() => openCurator()}
            aria-label="Open AI Art Curator"
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#1c1d17] via-[#141510] to-[#0d0e0a] border border-[#D4AF37]/50 shadow-[0_8px_32px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.45)] hover:border-[#D4AF37] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {/* Pulsing Sparkle Ring */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFE58F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D4AF37]"></span>
            </span>

            {/* Glowing Icon */}
            <div className="size-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center text-black shadow-inner">
              <Icon icon="solar:stars-minimalistic-bold-duotone" className="size-5 animate-spin-slow" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">AI Curator</span>
              <span className="text-xs font-semibold text-white group-hover:text-[#FFE58F] transition-colors">
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

          <div className="relative w-full sm:w-[450px] md:w-[480px] h-[92vh] sm:h-[660px] bg-[#0E0F0C] border border-[#3A3C2F] sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden pointer-events-auto z-10 animate-fadeUp">
            
            {/* --- HEADER --- */}
            <div className="px-5 py-3.5 border-b border-[#2A2C22] bg-[#141510]/95 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-2xl bg-gradient-to-tr from-[#AA7C11] via-[#D4AF37] to-[#FFE58F] p-0.5 shadow-lg">
                  <div className="w-full h-full bg-[#0E0F0C] rounded-[14px] flex items-center justify-center">
                    <Icon icon="solar:magic-stick-3-bold-duotone" className="size-5 text-[#D4AF37]" />
                  </div>
                  <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full border-2 border-[#0E0F0C]"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-serif font-bold text-white tracking-wide">
                      ArtHall AI Curator
                    </h3>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFE58F] border border-[#D4AF37]/30">
                      Gemini 3.6
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">Intelligent Catalog Matchmaker & Stylist</p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-1">
                {/* Toggle Chat History Tab */}
                <button
                  onClick={() => setShowHistory((prev) => !prev)}
                  title={showHistory ? "Back to Chat" : "View Chat History"}
                  aria-label="History"
                  className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                    showHistory
                      ? "bg-[#D4AF37] text-black shadow-md"
                      : "text-gray-400 hover:text-[#FFE58F] hover:bg-white/5"
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
                  className="p-2 rounded-xl text-gray-400 hover:text-[#FFE58F] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Icon icon="solar:pen-new-square-bold-duotone" className="size-4" />
                </button>

                {/* Close Drawer */}
                <button
                  onClick={closeCurator}
                  title="Close Curator"
                  aria-label="Close"
                  className="p-2 rounded-xl text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Icon icon="solar:close-square-bold" className="size-5" />
                </button>
              </div>
            </div>

            {/* --- VIEW: CHAT HISTORY LIST --- */}
            {showHistory ? (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-[#0A0B08]">
                <div className="flex items-center justify-between pb-3 border-b border-[#2A2C22] mb-3">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:history-bold-duotone" className="size-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      Past Consultations ({sessions.length})
                    </span>
                  </div>
                  <button
                    onClick={handleNewChat}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#FFE58F] transition-all cursor-pointer shadow-sm"
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
                        className={`group relative flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#1C1D15] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                            : "bg-[#12130F] border-[#2A2C22] hover:border-[#3A3C2F] hover:bg-[#161712]"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 pr-2">
                          <div
                            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              isActive
                                ? "bg-[#D4AF37]/20 text-[#FFE58F]"
                                : "bg-white/5 text-gray-400 group-hover:text-white"
                            }`}
                          >
                            <Icon icon="solar:chat-dots-bold-duotone" className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <h4
                              className={`text-xs font-bold truncate transition-colors ${
                                isActive ? "text-[#FFE58F]" : "text-gray-200 group-hover:text-white"
                              }`}
                            >
                              {sess.title || "Art Consultation"}
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                              <span>{dateFormatted}</span>
                              <span>•</span>
                              <span>{messageCount} msgs</span>
                            </p>
                          </div>
                        </div>

                        {/* Delete Session Button */}
                        <button
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          title="Delete this chat"
                          aria-label="Delete chat"
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {sessions.length > 1 && (
                  <div className="pt-3 border-t border-[#2A2C22] mt-3 text-center">
                    <button
                      onClick={handleClearAllHistory}
                      className="text-[11px] text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#2A2C22]">
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
                            ? "bg-[#D4AF37] text-black font-medium rounded-tr-none shadow-md"
                            : "bg-[#161713] text-gray-200 border border-[#2A2C22] rounded-tl-none shadow-sm"
                        }`}
                      >
                        <ChatMessageMarkdown
                          content={msg.content}
                          isUser={msg.role === "user"}
                        />
                      </div>

                      {/* Render Recommended Artwork Cards inside message */}
                      {msg.recommendedArts && msg.recommendedArts.length > 0 && (
                        <div className="w-full mt-3 grid grid-cols-1 gap-2.5">
                          <p className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                            <Icon icon="solar:gallery-favourite-bold-duotone" className="size-3.5" />
                            Curator Recommended Pieces ({msg.recommendedArts.length})
                          </p>
                          
                          {msg.recommendedArts.map((art) => {
                            const artId = art._id || art.id;
                            const isAdded = !!addedArtIds[artId];

                            return (
                              <div
                                key={artId}
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#12130f] border border-[#3A3C2F] hover:border-[#D4AF37]/60 transition-all duration-300 group"
                              >
                                {/* Artwork Image */}
                                <Link href={`/shop/${artId}`} className="relative size-16 rounded-lg overflow-hidden shrink-0 bg-black/40">
                                  <img
                                    src={art.image || "/placeholder.jpg"}
                                    alt={art.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <Link
                                      href={`/shop/${artId}`}
                                      className="text-xs font-bold text-white hover:text-[#D4AF37] truncate transition-colors"
                                    >
                                      {art.title}
                                    </Link>
                                    <span className="text-[11px] font-bold text-[#FFE58F]">
                                      ${art.price}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 truncate">
                                    By {art.artist || art.artistName || "Artist"} • {art.category}
                                  </p>
                                  <div className="flex items-center gap-1 text-[10px] text-[#D4AF37] mt-1">
                                    <Icon icon="solar:star-bold" className="size-2.5" />
                                    <span>{art.rating ? Number(art.rating).toFixed(1) : "5.0"}</span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-1 shrink-0">
                                  <button
                                    onClick={() => handleAddToCart(art)}
                                    disabled={isAdded}
                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                      isAdded
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#25261F] text-[#FFE58F] hover:bg-[#D4AF37] hover:text-black border border-[#3A3C2F]"
                                    }`}
                                  >
                                    <Icon icon={isAdded ? "solar:check-circle-bold" : "solar:cart-plus-bold"} className="size-3" />
                                    {isAdded ? "Added" : "Add"}
                                  </button>

                                  <Link
                                    href={`/shop/${artId}`}
                                    className="px-2 py-1 text-center rounded-lg text-[9px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    Details
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <span className="text-[9px] text-gray-500 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}

                  {/* Typing / Loading indicator */}
                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <div className="bg-[#161713] border border-[#2A2C22] rounded-2xl rounded-tl-none px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                        <span className="flex gap-1">
                          <span className="size-1.5 rounded-full bg-[#D4AF37] animate-bounce"></span>
                          <span className="size-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]"></span>
                          <span className="size-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                        <span>Curator is curating your personalized selection...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* --- QUICK PROMPT CHIPS --- */}
                <div className="px-4 py-2 border-t border-[#22241A] bg-[#0E0F0C]/60 flex gap-1.5 overflow-x-auto no-scrollbar">
                  {quickPrompts.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.text)}
                      disabled={isLoading}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#1A1B15] text-[#D8CCA9] hover:bg-[#D4AF37]/20 hover:text-[#FFE58F] border border-[#3A3C2F] transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* --- INPUT FORM --- */}
                <div className="p-3 border-t border-[#2A2C22] bg-[#141510]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2 bg-[#0E0F0C] border border-[#3A3C2F] focus-within:border-[#D4AF37] rounded-2xl px-3 py-1.5 transition-all shadow-inner"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about art styles, budget, living room decor..."
                      disabled={isLoading}
                      className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none py-1.5 px-1"
                    />

                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      aria-label="Send message"
                      className="size-8 rounded-xl bg-gradient-to-tr from-[#AA7C11] to-[#D4AF37] text-black font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 cursor-pointer shadow-md"
                    >
                      <Icon icon="solar:plain-bold" className="size-4" />
                    </button>
                  </form>
                  <div className="mt-1.5 text-center text-[10px] text-gray-500">
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
