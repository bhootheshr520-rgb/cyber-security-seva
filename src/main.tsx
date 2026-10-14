import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline asset caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New cyber defense advisory updates cached.');
  },
  onOfflineReady() {
    console.log('Cyber Security Seva: Emergency SOS and Legal Guidelines cached for offline access.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

