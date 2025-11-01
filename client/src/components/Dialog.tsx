import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
}

export default function Dialog({ isOpen, onClose, title, message, type = 'info' }: DialogProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b rounded-t-lg ${getTypeStyles()}`}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all ${getIconColor()}`}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-150 font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
