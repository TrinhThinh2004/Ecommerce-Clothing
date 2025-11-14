// src/components/Layout/Layout.tsx
import type { ReactNode } from "react";
import { useState } from "react";
import Header from "../Header/Header";
import Banner from "../Banner/Banner";
import Footer from "../Footer/Footer";
import ContactFloating from "../../components/FloatingContact/FloatingContact";
import UserChat from "../Chat/UserChat";

type Props = {
  children: ReactNode;
  noBanner?: boolean;
  noFooter?: boolean;
};

export default function Layout({
  children,
  noBanner = false,
  noFooter = false,
}: Props) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />
      <div className="h-[64px] md:h-[96px]" aria-hidden />

      {!noBanner && (
        <div className="bg-amber-50">
          <div className="mx-auto w-full max-w-7xl px-4 py-4">
            <Banner />
          </div>
        </div>
      )}

      <main className={noBanner ? "bg-white" : "bg-amber-50"}>
        <div className="mx-auto w-full max-w-7xl px-4 py-10 flex-1">
          {children}
        </div>  
      </main>

      <UserChat onOpenChange={setIsChatOpen} rightOffset={24} bottomOffset={96} />
      {!noFooter && <Footer />}

      <ContactFloating hidden={isChatOpen} placement="bottom-right" rightOffset={24} bottomOffset={24} />
    </div>
  );
}
