import { createRoot } from 'react-dom/client';
import App from './App.tsx';
console.log('%c AURA++ v2.0 LOADED ', 'background: #222; color: #bada55; font-size: 20px');
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
} else {
  console.error(
    "Root element not found. Please ensure an element with id 'root' exists in the HTML."
  );
}
