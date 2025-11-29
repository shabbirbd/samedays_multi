"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toast, useToast } from "@/lib/toastContext";
import { X } from "lucide-react";

const CustomToaster = () => {
  const { toasts, removeToast } = useToast();
  const toast = toasts[0];

  return (
    <div className="fixed bottom-6 right-6 z-[99999999999999] pointer-events-none">
      <AnimatePresence>
        {toast && (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        )}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  removeToast: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, removeToast }) => {
  const isError = toast.type === "error";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="pointer-events-auto flex flex-col gap-3 w-[320px] relative gap-[6px]"
    >
      <div className={`leading-snug w-full h-fit shadow-white/10 rounded-[6px] shadow-sm text-sm px-4 py-3 ${
        isError 
          ? "dark:text-[#f98686] text-[#c41c1c] bg-indarkred" 
          : "bg-[#2C3236] text-white"
      }`}>
        {toast.message}
      </div>
      <div className="w-full h-fit flex items-center justify-end">
        <div className="w-fit h-fit relative pl-[30px] overflow-hidden">
          <button
            className={`w-[58px] h-[24px] flex items-center justify-center relative z-[10] shadow-sm shadow-white/10 ${
              isError 
                ? "bg-indarkred text-white/90" 
                : "bg-[#2C3236] text-white/90"
            }`}
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 25% 100%)',
              borderRadius: '6px',
            }}
            onClick={() => removeToast(toast.id)}
          >
            <span className="mr-[-8px]">
              <X size={15} />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomToaster;
