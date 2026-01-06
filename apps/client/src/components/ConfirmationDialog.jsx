import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  isDangerous = false,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-scale-in overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3
            id="modal-title"
            className="text-lg font-bold text-gray-800 flex items-center gap-2"
          >
            {isDangerous && (
              <AlertTriangle className="text-red-500" size={20} />
            )}
            {title}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-base leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            {cancelText || t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-all transform active:scale-95 ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
            }`}
          >
            {confirmText || t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
