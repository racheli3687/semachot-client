import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ApiError } from './api/api.ts'



const queryClient = new QueryClient({
  defaultOptions:
  {
    queries:
    {
      // ניסיון חוזר אחד, אבל לא בשגיאות 4xx:
      // "לא נמצא", "אין הרשאה" או "נתונים שגויים" לא ישתנו בניסיון נוסף.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user": מי שביקשה במחשב פחות תנועה - תקבל פחות אנימציות */}
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </MotionConfig>
  </StrictMode>,
)
