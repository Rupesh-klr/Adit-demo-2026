import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";


const toastContainer = document.createElement("div");
toastContainer.id = "global-toast-container";
document.body.appendChild(toastContainer);
const root = createRoot(toastContainer);

let toasts = [];
let counter = 0;


const ToastContainer = ({ position = "top-center", children }) => {
  const positionClasses = {
    "top-right": "top-4 right-4 flex flex-col items-end",
    "top-left": "top-4 left-4 flex flex-col items-start",
    "bottom-right": "bottom-4 right-4 flex flex-col-reverse items-end",
    "bottom-left": "bottom-4 left-4 flex flex-col-reverse items-start",
    "top-center": "top-4 left-1/2 -translate-x-1/2 flex flex-col items-center",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999] pointer-events-none`}>
      <div className="pointer-events-auto flex flex-col gap-2">
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      </div>
    </div>
  );
};

const Toast = ({ id, message, type, variant, size, duration, showProgress, position, onClose }) => {
  const [progress, setProgress] = React.useState(100);

  
  const variants = {
    contained: {
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
      warning: "bg-amber-500 text-white",
      info: "bg-blue-600 text-white",
    },
    outlined: {
      success: "bg-white border-l-4 border-green-600 text-green-800 shadow-md",
      error: "bg-white border-l-4 border-red-600 text-red-800 shadow-md",
      warning: "bg-white border-l-4 border-amber-500 text-amber-800 shadow-md",
      info: "bg-white border-l-4 border-blue-600 text-blue-800 shadow-md",
    }
  };

  const icons = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info"
  };

  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    
    let progressTimer;
    if (showProgress) {
      const start = Date.now();
      progressTimer = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        if (remaining <= 0) clearInterval(progressTimer);
      }, 10);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [id, duration, onClose, showProgress]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden p-4 rounded-lg flex items-center gap-3 min-w-[300px] ${variants[variant][type]}`}
    >
      <span className="material-symbols-rounded">{icons[type]}</span>
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={() => onClose(id)} className="hover:opacity-70">
        <span className="material-symbols-rounded text-sm">close</span>
      </button>
      
      {showProgress && (
        <div className="absolute bottom-0 left-0 h-1 bg-black/10 w-full">
          <motion.div 
            className="h-full bg-black/20" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
    </motion.div>
  );
};


const renderToasts = () => {
  const grouped = toasts.reduce((acc, t) => {
    const pos = t.position || "top-center";
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(t);
    return acc;
  }, {});

  root.render(
    <>
      {Object.entries(grouped).map(([pos, list]) => (
        <ToastContainer key={pos} position={pos}>
          {list.map((t) => (
            <Toast key={t.id} {...t} onClose={removeToast} />
          ))}
        </ToastContainer>
      ))}
    </>
  );
};

const removeToast = (id) => {
  toasts = toasts.filter((t) => t.id !== id);
  renderToasts();
};

const showToast = (message, type, duration, variant, options = {}) => {
  const id = counter++;
  toasts.push({
    id, message, type, duration, variant,
    showProgress: options.showProgress ?? true,
    position: options.position || "top-left"
  });
  renderToasts();
};


export const toast = {
  success: (msg, opt) => showToast(msg, "success", 3000, "outlined", opt),
  error: (msg, opt) => showToast(msg, "error", 5000, "contained", opt),
  warn: (msg, opt) => showToast(msg, "warning", 4000, "outlined", opt),
  info: (msg, opt) => showToast(msg, "info", 3000, "outlined", opt),
};