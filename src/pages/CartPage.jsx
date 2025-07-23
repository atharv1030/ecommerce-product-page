import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 min-h-screen relative bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Navbar cartCount={orderPlaced ? 0 : cartCount} />

      {showSuccess && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Order Placed Successfully!</h3>
            <p className="mb-4">Preparing your invoice...</p>
          </div>
        </div>
      )}

      {orderPlaced ? (
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-8">Order Confirmation (#{orderDetails.orderId})</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div ref={invoiceRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-blue-600">NexusMart</h2>
                  <div className="text-right">
                    <p className="font-semibold">Order #{orderDetails.orderId}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {orderDetails.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-4">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-gray-300 dark:border-gray-700 pb-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <p className="text-blue-600 font-bold">
                              ₹{item.price} × {item.quantity}
                            </p>
                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{orderDetails.total}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Thank you for your purchase!</p>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Link
                  to="/"
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded transition-colors"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={downloadInvoice}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
                >
                  Download Invoice (PDF)
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg h-fit sticky top-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-4">Order Details</h3>
              <div className="space-y-3">
                <div><p className="font-semibold">Order Number:</p><p>#{orderDetails.orderId}</p></div>
                <div><p className="font-semibold">Date:</p><p>{orderDetails.date.toLocaleDateString()}</p></div>
                <div><p className="font-semibold">Items:</p><p>{orderDetails.items.reduce((sum, item) => sum + item.quantity, 0)}</p></div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                  <p className="font-semibold">Total Amount:</p>
                  <p className="text-lg font-bold">₹{orderDetails.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-8">Your Cart ({cartCount})</h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-300 text-lg mb-6">Your cart is empty</p>
              <Link
                to="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-gray-300 dark:border-gray-700 pb-6">
                    <div className="w-full sm:w-36 h-36 flex-shrink-0 rounded overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-xl">{item.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.description}</p>
                      <p className="text-blue-600 font-bold text-lg">₹{item.price}</p>
                      <div className="flex items-center gap-6 mt-3 flex-wrap">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
                          <span className="px-6 py-2 border-x">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6">
                  <Link
                    to="/"
                    className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 px-8 py-3 rounded transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg h-fit sticky top-4 border border-gray-200 dark:border-gray-700 shadow-md">
                <h3 className="font-bold text-xl mb-6">Order Summary</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 mt-6 pt-4 font-bold text-lg flex justify-between">
                  <span>Total:</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full mt-6 py-3 rounded-lg transition-colors ${
                    cartItems.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CartPage;
