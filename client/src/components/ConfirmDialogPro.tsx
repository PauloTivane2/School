import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'success' | 'error' | 'warning';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel: () => void;
}

export default function ConfirmDialogPro({
  isOpen,
  title,
  message,
  type = 'confirm',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const getIcon = () => {
    const iconProps = { size: 56, strokeWidth: 1.5 };
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-emerald-500" />;
      case 'error':
        return <XCircle {...iconProps} className="text-rose-500" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="text-amber-500" />;
      case 'alert':
        return <Info {...iconProps} className="text-blue-500" />;
      default:
        return <AlertCircle {...iconProps} className="text-blue-500" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'success':
        return 'from-emerald-500/10 to-teal-500/10';
      case 'error':
        return 'from-rose-500/10 to-red-500/10';
      case 'warning':
        return 'from-amber-500/10 to-orange-500/10';
      default:
        return 'from-blue-500/10 to-indigo-500/10';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600';
      case 'error':
        return 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50`} />
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCancel}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
              >
                <X size={20} className="text-gray-600" />
              </motion.button>

              <div className="relative p-8">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.1, duration: 0.6 }}
                  className="flex justify-center mb-6"
                >
                  <div className="p-4 rounded-full bg-white shadow-lg">
                    {getIcon()}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 text-center mb-3"
                >
                  {title}
                </motion.h3>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-center mb-8 whitespace-pre-line leading-relaxed"
                >
                  {message}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3"
                >
                  {type === 'confirm' || type === 'warning' ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-semibold text-gray-700"
                      >
                        {cancelText}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (onConfirm) onConfirm();
                          onCancel();
                        }}
                        className={`flex-1 px-6 py-3 rounded-xl transition-all font-semibold text-white shadow-lg ${getButtonColor()}`}
                      >
                        {confirmText}
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onCancel}
                      className={`w-full px-6 py-3 rounded-xl transition-all font-semibold text-white shadow-lg ${getButtonColor()}`}
                    >
                      OK
                    </motion.button>
                  )}
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
