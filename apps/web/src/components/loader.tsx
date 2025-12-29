import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="size-12 rounded-full border-4 border-muted" />
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">解析中...</p>
      </div>
    </div>
  );
}
