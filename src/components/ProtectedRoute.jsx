// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const hasUsedPreview = localStorage.getItem('previewUsed');

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (token) return; // ✅ Logged in, allow all access

    if (location.pathname === '/') {
      // 🕒 Allow preview only once
      if (hasUsedPreview) {
        setRedirect(true); // ⛔ Already used preview, redirect immediately
      } else {
        const timer = setTimeout(() => {
          localStorage.setItem('previewUsed', 'true'); // 📝 Mark preview as used
          setRedirect(true);
        }, 10000); // ⏳ 10 sec
        return () => clearTimeout(timer);
      }
    } else {
      // ⛔ All other pages need login
      setRedirect(true);
    }
  }, [location.pathname, token, hasUsedPreview]);

  if (redirect && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
