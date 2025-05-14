// Importing from shadcn's toast component
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  useToast as useToastOriginal,
} from "@/components/ui/use-toast";

type ToastOptions = Omit<ToastProps, "id">;

export function useToast() {
  const { toast } = useToastOriginal();
  return { toast };
}
