import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, ChevronDown, ChevronUp, Minimize2 } from 'lucide-react';

const predefinedResponses = {
  greeting: "Hello! I'm NexusMart AI Assistant. How can I help you today?",
  products: "You can browse our products by visiting the homepage. Use category filters to find specific items you're looking for!",
  categories: "We have multiple categories including Electronics, Fashion, Home & Living, and more! Use the filter buttons on the homepage.",
  order: "To place an order, add items to your cart and proceed to checkout. You'll receive an invoice after successful order placement.",
  payment: "We accept various payment methods including credit/debit cards and digital wallets. Payment is processed securely at checkout.",
  shipping: "Shipping times vary based on your location. Typically, orders are delivered within 3-7 business days.",
  returns: "We offer a hassle-free return policy. If you're not satisfied with your purchase, you can return it within 30 days.",
  account: "You can create an account by signing up. Having an account lets you track orders, save favorites, and faster checkout.",
  contact: "You can reach our support team through the contact form on our website or email us at support@nexusmart.com",
  pricing: "Our prices are competitive and we often have discounts! Check the product pages for current pricing and special offers.",
  default: "I'm here to help! Could you please rephrase your question? I can assist with products, orders, shipping, returns, and more."
};

const keywordMatches = {
  greeting: ['hello', 'hi', 'hey', 'start', 'help'],
  products: ['product', 'items', 'buy', 'shop', 'browse', 'catalog'],
  categories: ['category', 'filter', 'type', 'kind', 'sort'],
  order: ['order', 'purchase', 'buy', 'checkout', 'cart'],
  payment: ['payment', 'pay', 'card', 'money', 'price', 'cost'],
  shipping: ['shipping', 'delivery', 'deliver', 'arrival', 'time'],
  returns: ['return', 'refund', 'exchange', 'money back'],
  account: ['account', 'login', 'signup', 'register', 'profile'],
  contact: ['contact', 'support', 'help', 'reach', 'talk'],
  pricing: ['price', 'cost', 'discount', 'offer', 'sale', 'cheap']
};

const getResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  for (const [key, keywords] of Object.entries(keywordMatches)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return predefinedResponses[key];
    }
  }

  return predefinedResponses.default;
};

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: predefinedResponses.greeting, timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userMessage.content);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl cursor-pointer
                   bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white
                   hover:shadow-2xl transition-shadow duration-300
                   ${isOpen ? 'hidden' : 'flex'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col`}
            style={{ height: isMinimized ? '64px' : '600px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">NexusMart AI</h3>
                  <p className="text-xs text-white/70">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? <ChevronUp size={18} /> : <Minimize2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] text-white rounded-br-md'
                            : 'bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm'
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/10 transition-all">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="p-2 bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatbot;