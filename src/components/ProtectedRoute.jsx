// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState('checking'); // 'checking', 'preview', 'authenticated', 'redirect'
  const token = localStorage.getItem('token');
  const hasUsedPreview = localStorage.getItem('previewUsed');

  useEffect(() => {
    if (token) {
      setStatus('authenticated');
      return;
    }

    if (location.pathname === '/') {
      if (hasUsedPreview) {
        setStatus('redirect');
      } else {
        setStatus('preview');
        const timer = setTimeout(() => {
          localStorage.setItem('previewUsed', 'true');
          setStatus('redirect');
        }, 10000);

        return () => clearTimeout(timer);
      }
    } else {
      setStatus('redirect');
    }
  }, [location.pathname, token, hasUsedPreview]);

  if (status === 'checking') return <div>Loading...</div>;

  if (status === 'redirect') return (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  if (status === 'preview') {
    return (
      <div>
        {children}
        <div className="preview-notice fixed bottom-2 left-2 text-xs bg-yellow-100 text-black px-3 py-1 rounded shadow">
          You're in preview mode. Login required after 10 seconds.
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
