import { useRef, useState } from "react";

interface UseToastReturn {
  toastMessage: string | null;
  showToast: (message: string) => void;
}

/**
 *
 * @param duration in milliseconds (default: 3000)
 */
const useToast = (duration: number = 3000): UseToastReturn => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<NodeJS.Timeout>();

  const showToast = (message: string) => {
    setToastMessage(message);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, duration);
    toastTimer.current = timer;
  };

  return { toastMessage, showToast };
};

export default useToast;
