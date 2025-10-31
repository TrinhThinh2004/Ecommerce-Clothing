import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import SideNav from "./SideNav";

type Props = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminLayout({ title, actions, children }: Props) {
  const [isNavOpen, setNavOpen] = useState(true);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await import("../../../api/auth").then(({ Logout }) => Logout());
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      return;
    }
    setMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-neutral-50">
      <header className="z-10 flex h-[60px] flex-shrink-0 items-center justify-between gap-4 border-b bg-white/90 px-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="text-lg font-extrabold tracking-wide hover:opacity-90"
          >
            Admin Dashboard
          </Link>
          <button
            className="hidden h-9 w-9 place-content-center rounded-md border border-neutral-200 lg:grid"
            onClick={() => setNavOpen(!isNavOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div 
          className="relative" 
          ref={menuRef} 
          onBlur={handleBlur}
        >
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none"
          >
            <User className="h-5 w-5 text-neutral-500" />
            <span className="hidden sm:inline">Xin chào, Admin</span>
            <ChevronDown
              className={`h-4 w-4 text-neutral-400 transition-transform ${
                isMenuOpen ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-neutral-900 hover:bg-red-100 hover:text-red-700"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside
          className={`flex-shrink-0 border-r bg-white transition-[width] duration-300 ease-in-out ${
            isNavOpen ? "w-[280px]" : "w-0"
          } overflow-y-auto`}
        >
          <div className="p-4">
            <SideNav />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-extrabold tracking-wide">{title}</h1>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}