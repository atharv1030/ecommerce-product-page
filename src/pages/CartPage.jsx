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
    // Save order details before clearing cart
    const currentOrder = {
      items: [...cartItems],
      total: cartTotal,
      date: new Date(),
      orderId: Date.now().toString().slice(-6)
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
    <div className="container mx-auto p-4 max-w-6xl min-h-screen relative">
      <Navbar cartCount={orderPlaced ? 0 : cartCount} />

      {/* Confetti Animation */}
      {showSuccess && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Order Placed Successfully!</h3>
            <p className="mb-4">Preparing your invoice...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {orderPlaced ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Order Confirmation (#{orderDetails.orderId})</h2>
          
          {/* Invoice Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div ref={invoiceRef} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-blue-600">NexusMart</h2>
                  <div className="text-right">
                    <p className="font-semibold">Order #{orderDetails.orderId}</p>
                    <p className="text-sm text-gray-500">{orderDetails.date.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-4">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b pb-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-blue-600 font-bold">₹{item.price} × {item.quantity}</p>
                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{orderDetails.total}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Thank you for your purchase!</p>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Link
                  to="/"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded transition-colors"
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

            {/* Order Summary Sidebar */}
            <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
              <h3 className="font-bold text-lg mb-4">Order Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Order Number:</p>
                  <p>#{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="font-semibold">Date:</p>
                  <p>{orderDetails.date.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Items:</p>
                  <p>{orderDetails.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="font-semibold">Total Amount:</p>
                  <p className="text-lg font-bold">₹{orderDetails.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Original Cart Page Content */
        <>
          <h2 className="text-2xl font-bold mb-6">Your Cart ({cartCount})</h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b pb-4">
                    <div className="w-full sm:w-24 h-24 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                      <p className="text-blue-600 font-bold mt-2">₹{item.price}</p>

                      <div className="flex items-center mt-4 gap-4">
                        <div className="flex items-center border rounded">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-x">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-6">
                  <Link to="/" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded transition-colors">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 font-bold text-lg flex justify-between">
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