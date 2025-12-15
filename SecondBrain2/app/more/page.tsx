import { MobileContainer } from "@/components/mobile-container";
import { BottomNav } from "@/components/bottom-nav";

export default function MorePage() {
  return (
    <MobileContainer>
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-center">More</h1>
        </div>
      </header>
      <div className="p-4">
        <p className="text-zinc-500 text-center mt-8">その他の設定はここに表示されます</p>
      </div>
      <BottomNav />
    </MobileContainer>
  );
}

