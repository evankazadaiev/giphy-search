import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";


async function enableMocking() {
    if (import.meta.env.DEV && import.meta.env.VITE_APP_MOCK_API === 'true') {
        const { worker } = await import('./mocks/browser');

        return worker.start({
            onUnhandledRequest: 'bypass',
        });
    }

    return Promise.resolve();
}



enableMocking().then(() => createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </StrictMode>,
));