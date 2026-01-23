"use client";

import { useState, useRef, FormEvent, useCallback, useEffect, useMemo } from 'react';
import { 
  MessageCircle, X, Send, Loader2, Leaf, Droplets, Sun, Bug, Heart, 
  Sparkles, TrendingUp, ThermometerSun, Scissors, ChevronDown,
  Zap, Bot, User, ExternalLink, ShoppingBag, BookOpen, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ============================================================================
// TYPES
// ============================================================================

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  references?: Array<{ title: string; url: string; type?: string }>;
  carePlan?: string[];
  products?: Array<{ id: string; name: string; slug: string; price?: string; images?: Array<{ src: string }> }>;
  followUpQuestions?: string[];
  detectedPlant?: string;
  confidence?: 'low' | 'medium' | 'high';
  mood?: 'helpful' | 'empathetic' | 'celebratory' | 'educational';
  trendingTip?: string;
  timestamp?: Date;
}

// ============================================================================
// QUICK ACTIONS DATA
// ============================================================================

const QUICK_CATEGORIES = [
  { 
    id: 'care',
    label: 'Plant Care', 
    icon: Droplets, 
    color: 'from-blue-500 to-cyan-500',
    questions: [
      "How often should I water my money plant?",
      "What's the best soil mix for succulents?",
      "How much light does a peace lily need?",
      "When should I fertilize my plants?"
    ]
  },
  {
    id: 'problems',
    label: 'Plant Problems',
    icon: Bug,
    color: 'from-red-500 to-orange-500',
    questions: [
      "Why are my plant's leaves turning yellow?",
      "How do I get rid of mealybugs?",
      "My plant is drooping - help!",
      "Brown tips on my leaves - what's wrong?"
    ]
  },
  {
    id: 'recommend',
    label: 'Recommendations',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    questions: [
      "Best low-maintenance plants for beginners",
      "Pet-safe indoor plants",
      "Plants that purify air naturally",
      "Best plants for a dark room"
    ]
  },
  {
    id: 'trends',
    label: 'Trending',
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-500',
    questions: [
      "What plants are trending in 2024?",
      "Best plants for Instagram aesthetics",
      "Rare plants that are popular now",
      "How to create an indoor jungle"
    ]
  },
  {
    id: 'propagation',
    label: 'Propagation',
    icon: Scissors,
    color: 'from-green-500 to-emerald-500',
    questions: [
      "How to propagate a pothos?",
      "Best plants to grow from cuttings",
      "When is the best time to take cuttings?",
      "Water vs soil propagation - which is better?"
    ]
  },
  {
    id: 'seasonal',
    label: 'Seasonal Tips',
    icon: ThermometerSun,
    color: 'from-amber-500 to-yellow-500',
    questions: [
      "How to care for plants in monsoon?",
      "Summer plant care tips for India",
      "Protect plants from winter cold",
      "What to do with plants in extreme heat?"
    ]
  }
];

// Fun typing messages
const TYPING_MESSAGES = [
  "Plantsy is thinking... 🌱",
  "Consulting the plant wisdom... 🧠",
  "Leafing through my knowledge... 📚",
  "Growing an answer for you... 🌿",
  "Photosynthesizing a response... ☀️"
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function PlantsyChatWidget() {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [typingMessage, setTypingMessage] = useState(TYPING_MESSAGES[0]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Memoized welcome message
  const welcomeMessage: ChatMessage = useMemo(() => ({
    id: 'welcome',
    role: 'assistant',
    content: "Hey there, plant friend! 🌱✨\n\nI'm **Plantsy**, your AI plant doctor and care companion!\n\nI'm here to help you become a confident plant parent. Ask me anything about:\n\n🌿 **Plant Care** - Watering, light, soil, feeding\n🔍 **Diagnosis** - What's wrong with my plant?\n💚 **Recommendations** - Find your perfect plants\n📈 **Trends** - What's hot in 2024-2026\n\nTap a category below or just type your question!",
    followUpQuestions: [
      "I'm new to plants - where do I start?",
      "Help! My plant looks sick!",
      "What's trending right now?"
    ],
    confidence: 'high',
    mood: 'helpful',
    timestamp: new Date()
  }), []);
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [messages.length, welcomeMessage]);

  // Callbacks
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Check if should show scroll button
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  }, []);

  // Play notification sound
  const playSound = useCallback(() => {
    if (soundEnabled && typeof window !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch {
        // Silently fail if audio not supported
      }
    }
  }, [soundEnabled]);

  // Rotate typing messages
  useEffect(() => {
    if (pending) {
      const interval = setInterval(() => {
        setTypingMessage(TYPING_MESSAGES[Math.floor(Math.random() * TYPING_MESSAGES.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [pending]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Event listeners for external control
  useEffect(() => {
    const handleOpen = () => open();
    const handleClose = () => close();
    const handleToggle = () => toggle();

    window.addEventListener('plantsy:open', handleOpen);
    window.addEventListener('plantsy:close', handleClose);
    window.addEventListener('plantsy:toggle', handleToggle);

    return () => {
      window.removeEventListener('plantsy:open', handleOpen);
      window.removeEventListener('plantsy:close', handleClose);
      window.removeEventListener('plantsy:toggle', handleToggle);
    };
  }, [open, close, toggle]);

  // Dispatch state and focus input
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('plantsy:state', { detail: { isOpen } }));
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Handle quick question click
  const handleQuickQuestion = useCallback((question: string) => {
    setInput(question);
    setSelectedCategory(null);
    setTimeout(() => {
      const syntheticEvent = { preventDefault: () => {} } as FormEvent;
      handleSubmitInternal(syntheticEvent, question);
    }, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Main submit handler
  const handleSubmitInternal = async (event: FormEvent, overrideQuestion?: string) => {
    event.preventDefault();
    const question = overrideQuestion || input.trim();
    if (!question || pending) return;

    setInput('');
    setSelectedCategory(null);
    
    const userMessage: ChatMessage = { 
      id: crypto.randomUUID(), 
      role: 'user', 
      content: question,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setPending(true);

    try {
      const history = [...messages, userMessage].slice(-8).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const res = await fetch('/api/agents/plantsy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context: { conversationHistory: history } }),
      });

      if (!res.ok) throw new Error('Failed to reach Plantsy API');

      const data = await res.json();
      
      if (!data?.success || !data?.answer) {
        throw new Error('Invalid response from Plantsy API');
      }

      const answer = data.answer;
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answer?.answer || 'I was unable to load guidance just now.',
        references: answer?.references || [],
        carePlan: answer?.carePlan || [],
        products: answer?.recommendedProducts?.map((prod: { id: string; name: string; slug: string; price?: string; images?: Array<{ src: string }> }) => ({
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          images: prod.images,
        })) || [],
        followUpQuestions: answer?.followUpQuestions || [],
        detectedPlant: answer?.detectedPlant,
        confidence: answer?.confidence,
        mood: answer?.mood,
        trendingTip: answer?.trendingTip,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      playSound();
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "Oops! 🌿 I'm having a little hiccup connecting right now.\n\nBut don't worry - I have tons of plant wisdom stored locally! Try asking me about:\n\n• 🪴 Money plant or snake plant care\n• 🌿 Monstera watering schedule\n• 🔍 Why leaves turn yellow\n• 💚 Best beginner plants\n\nOr try again in a moment!",
          followUpQuestions: [
            "How to care for money plant?",
            "Snake plant tips for beginners",
            "Why are my leaves turning yellow?"
          ],
          mood: 'empathetic' as const,
          timestamp: new Date()
        },
      ]);
    } finally {
      setPending(false);
    }
  };
  
  const handleSubmit = (event: FormEvent) => handleSubmitInternal(event);

  // ============================================================================
  // SUB-COMPONENTS
  // ============================================================================

  // Confidence badge
  const ConfidenceBadge = ({ level, mood }: { level?: string; mood?: string }) => {
    if (!level) return null;
    const configs = {
      high: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Zap, label: 'AI-Enhanced' },
      medium: { bg: 'bg-amber-100', text: 'text-amber-700', icon: BookOpen, label: 'Knowledge Base' },
      low: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Bot, label: 'General' }
    };
    const config = configs[level as keyof typeof configs] || configs.medium;
    const Icon = config.icon;
    
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${config.bg} ${config.text}`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </span>
        {mood && (
          <span className="text-xs text-gray-400">
            {mood === 'empathetic' ? '💚' : mood === 'celebratory' ? '🎉' : mood === 'educational' ? '📚' : '🌿'}
          </span>
        )}
      </div>
    );
  };

  // Message bubble
  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === 'user';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      >
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="flex-shrink-0 mr-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
              <span className="text-sm">🌱</span>
            </div>
          </div>
        )}
        
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg rounded-br-md' 
              : 'bg-white shadow-md border border-gray-100 rounded-bl-md'
          }`}
        >
          {/* Confidence badge */}
          {!isUser && <ConfidenceBadge level={message.confidence} mood={message.mood} />}
          
          {/* Detected plant badge */}
          {message.detectedPlant && (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mb-2"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700 font-medium">
                <Leaf className="h-3 w-3" />
                Detected: {message.detectedPlant}
              </span>
            </motion.div>
          )}
          
          {/* Message content */}
          <div className={`whitespace-pre-line leading-relaxed text-sm ${isUser ? '' : 'text-gray-700'}`}>
            {message.content.split('\n').map((line, i) => {
              // Bold text between **
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {parts.map((part, j) => 
                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                  )}
                </p>
              );
            })}
          </div>
          
          {/* Care Plan */}
          {message.carePlan && message.carePlan.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3 border border-emerald-100"
            >
              <p className="font-semibold text-emerald-700 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Leaf className="h-3.5 w-3.5" /> Quick Care Plan
              </p>
              <ul className="mt-2 space-y-2">
                {message.carePlan.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-emerald-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {/* Products */}
          {message.products && message.products.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <ShoppingBag className="h-3.5 w-3.5" /> Shop These
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {message.products.map((prod) => (
                  <a
                    key={prod.id}
                    href={`/shop/${prod.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-shrink-0 w-28 rounded-xl bg-gray-50 border border-gray-100 p-2 hover:border-emerald-300 hover:shadow-md transition-all group/card"
                  >
                    {prod.images && prod.images[0] && (
                      <div className="relative w-full h-20 mb-2 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={prod.images[0].src}
                          alt={prod.name}
                          fill
                          className="object-cover group-hover/card:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-tight">{prod.name}</p>
                    {prod.price && (
                      <p className="text-xs text-emerald-600 font-bold mt-1">₹{prod.price}</p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* References */}
          {message.references && message.references.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-2">
              <p className="font-semibold text-gray-600 text-xs uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> Learn More
              </p>
              <ul className="mt-1.5 space-y-1">
                {message.references.map((ref, idx) => (
                  <li key={idx}>
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                    >
                      {ref.type === 'product' ? '🪴' : ref.type === 'trend' ? '📈' : '📖'} {ref.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Follow-up Questions */}
          {message.followUpQuestions && message.followUpQuestions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">💬 Quick follow-ups:</p>
              <div className="flex flex-wrap gap-1.5">
                {message.followUpQuestions.map((q, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors text-left"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          
          {/* Timestamp */}
          {message.timestamp && (
            <p className={`text-[10px] mt-2 ${isUser ? 'text-emerald-100' : 'text-gray-400'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        
        {/* Avatar for user */}
        {isUser && (
          <div className="flex-shrink-0 ml-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Typing indicator
  const TypingIndicator = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-2"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md animate-pulse">
        <span className="text-sm">🌱</span>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-gray-500">{typingMessage}</span>
        </div>
      </div>
    </motion.div>
  );

  // Category selector
  const CategorySelector = () => (
    <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {QUICK_CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat.id 
                ? `bg-gradient-to-r ${cat.color} text-white shadow-md` 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <cat.icon className="h-3.5 w-3.5" />
            {cat.label}
          </motion.button>
        ))}
      </div>
      
      {/* Category questions */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-1.5">
              {QUICK_CATEGORIES.find(c => c.id === selectedCategory)?.questions.map((q, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-left text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-100 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        aria-label="Chat with Plantsy"
        className="hidden md:inline-flex fixed bottom-6 right-6 z-50 h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-2xl hover:shadow-emerald-500/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 transition-all duration-300"
        onClick={toggle}
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="h-7 w-7" />
              {/* Notification dot */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-200 items-center justify-center">
                  <Leaf className="h-2.5 w-2.5 text-emerald-700" />
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-24 left-3 right-3 z-50 flex w-auto max-w-none flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/20 md:left-auto md:right-6 md:w-[420px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-4 py-4 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              
              <div className="relative flex items-center gap-3">
                <motion.div 
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <span className="text-2xl">🌱</span>
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Plantsy
                    <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-xs font-medium">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Plant Doctor
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    Online • Ready to help! 🪴
                  </p>
                </div>
                
                {/* Sound toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                
                {/* Close button (mobile) */}
                <button
                  onClick={close}
                  className="rounded-full p-2 hover:bg-white/20 transition-colors md:hidden"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex max-h-[380px] min-h-[280px] flex-col gap-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4"
            >
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {/* Typing indicator */}
              <AnimatePresence>
                {pending && <TypingIndicator />}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-36 right-4 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-gray-50"
                >
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Category Selector */}
            {messages.length <= 2 && <CategorySelector />}

            {/* Input Form */}
            <form 
              ref={formRef} 
              onSubmit={handleSubmit} 
              className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={pending}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder={pending ? "Plantsy is typing..." : "Ask about any plant... 🌿"}
              />
              <motion.button
                type="submit"
                disabled={pending || !input.trim()}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-3 text-white shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </motion.button>
            </form>
            
            {/* Footer */}
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100">
              <p className="text-[10px] text-emerald-600 text-center flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by AI • <span className="font-semibold">Whole Lot of Nature</span> • Stay Loyal to the Soil 🌍
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
