import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Minus, Plus, Download, ArrowLeft, CheckCircle } from 'lucide-react';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const invoiceRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCheckout = () => {
    setShowSuccess(true);
    const currentOrder = {
      items: [...cartItems],
      total: cartTotal,
      date: new Date(),
      orderId: Date.now().toString().slice(-6),
    };
    setOrderDetails(currentOrder);

    setTimeout(() => {
      setShowSuccess(false);
      setShowInvoice(true);
      setOrderPlaced(true);
      clearCart();
    }, 3000);
  };

  const downloadInvoice = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`nexusmart-order-${orderDetails.orderId}.pdf`);
    });
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar cartCount={orderPlaced ? 0 : cartCount} />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
            />
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center"
              >
                <CheckCircle size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Order Placed Successfully!
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Preparing your invoice...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {orderPlaced ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 mb-4">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Order Confirmation
              </h2>
              <p className="text-gray-500 mt-2">Order #{orderDetails.orderId}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div ref={invoiceRef} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center pb-6 mb-6 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        NexusMart
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Premium Shopping Experience</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">Order #{orderDetails.orderId}</p>
                      <p className="text-sm text-gray-500">
                        {orderDetails.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                    <div className="space-y-4">
                      {orderDetails.items.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="text-blue-600 font-semibold">
                                ₹{item.price} × {item.quantity}
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                      <span>Total:</span>
                      <span className="text-gradient">₹{orderDetails.total}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">Thank you for your purchase!</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-medium transition-all"
                  >
                    <ArrowLeft size={18} />
                    Continue Shopping
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadInvoice}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    <Download size={18} />
                    Download Invoice
                  </motion.button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-fit sticky top-24 border border-gray-100 dark:border-gray-700 shadow-lg">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Order Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Number:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">#{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{orderDetails.date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{orderDetails.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                      <span className="text-xl font-bold text-gradient">₹{orderDetails.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Cart
              </h2>
              <p className="text-gray-500 mt-2">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
            </motion.div>

            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Start Shopping
                </Link>
              </motion.div>
            ) : (
              <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className="flex flex-col sm:flex-row gap-6 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                      <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                        <p className="text-xl font-bold text-gradient mt-2">₹{item.price}</p>
                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                          <div className="flex items-center gap-3 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-500 text-gray-700 dark:text-white transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-500 text-gray-700 dark:text-white transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-medium transition-colors"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    <ArrowLeft size={18} />
                    Continue Shopping
                  </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-fit sticky top-24 border border-gray-100 dark:border-gray-700 shadow-lg">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                          <span className="line-clamp-1">{item.name}</span>
                          <span className="text-gray-400">× {item.quantity}</span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                      <span>Total:</span>
                      <span className="text-gradient">₹{cartTotal}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      cartItems.length === 0
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                    }`}
                  >
                    Proceed to Checkout
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;