import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    borderColor: "border-green-200",
    iconColor: "text-green-500"
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    borderColor: "border-red-200",
    iconColor: "text-red-500"
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-500"
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500"
  }
};

function Toast({ message, type = "success", onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const { icon: Icon, bgColor, textColor, borderColor, iconColor } = toastTypes[type];

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md mb-2 animate-slide-in`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}

export default Toast;