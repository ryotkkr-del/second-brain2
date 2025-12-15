import { cn } from "@/lib/utils";

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div
        className={cn(
          "mx-auto max-w-md border-x border-zinc-200 bg-white min-h-screen relative",
          className
        )}
      >
        {children}
      </div>
    </main>
  );
}

