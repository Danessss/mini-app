import { useToasts } from "@/hooks/use-toast";

export function Toaster() {
  const { ToastContainer } = useToasts();
  return <ToastContainer />;
}
