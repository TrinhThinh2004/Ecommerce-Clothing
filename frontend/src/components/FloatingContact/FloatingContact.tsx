// src/components/FloatingContact/FloatingContactRadix.tsx
import * as Popover from "@radix-ui/react-popover";
import { PhoneCall, X } from "lucide-react";
import { clsx } from "clsx";
import { useMemo } from "react";

type Props = {
  phone?: string;
  facebookUrl?: string;
  zaloUrl?: string;
  label?: string;
  className?: string;
  /** Cố định ở giữa cạnh phải hoặc góc phải dưới */
  placement?: "right-center" | "bottom-right";
  rightOffset?: number | string;
  bottomOffset?: number | string;
  hidden?: boolean;
};

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9V12.1h2.54V9.93c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.55v1.86h2.77l-.44 2.86h-2.33v7.03C18.34 21.2 22 17.06 22 12.06z" />
    </svg>
  );
}
function ZaloIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19 2H5a3 3 0 0 0-3 3v9.5A3.5 3.5 0 0 0 5.5 18H7l3.5 4 1.5-4H19a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3ZM8.2 13.4H6l2.89-4.09V9H6.2V7.8h4.04l-2.04 2.89h2.15v1.2H8.2Zm6.4 0h-3.1V7.8h1.2v4.4h1.9v1.2Zm1.2-5.6h1.2v6.8h-1.2V7.8Zm-4.9-1.1h1.3v1.1h-1.3V6.7Z" />
    </svg>
  );
}

export default function FloatingContactRadix({
  phone = "0359 744 735",
  facebookUrl = "https://facebook.com/",
  zaloUrl = "https://zalo.me/",
  label = "Liên hệ 160STORE",
  className,
  placement = "right-center",
  rightOffset = 24,
  bottomOffset = 24,
  hidden = false,
}: Props) {
  if (hidden) return null;
  // Tính style cố định cho trigger (nằm ngoài mọi container)
  const triggerStyle = useMemo<React.CSSProperties>(() => {
    const right =
      typeof rightOffset === "number" ? `${rightOffset}px` : rightOffset;
    const bottom =
      typeof bottomOffset === "number" ? `${bottomOffset}px` : bottomOffset;

    if (placement === "right-center") {
      return {
        position: "fixed",
        top: "90%",
        right: "24px",
        transform: "translateY(-50%)",
        zIndex: 60,
      };
    }
    return {
      position: "fixed",
      right: `calc(${right} + env(safe-area-inset-right))`,
      bottom: `calc(${bottom} + env(safe-area-inset-bottom))`,
      zIndex: 60,
    };
  }, [placement, rightOffset, bottomOffset]);

  return (
    <Popover.Root>
      {/* Trigger: nút tròn đen, luôn fixed ngoài layout */}
      <Popover.Trigger asChild>
        <button
          style={triggerStyle}
          className={clsx(
            "relative grid h-14 w-14 place-content-center rounded-full bg-black text-white",
            "shadow-[0_10px_25px_-10px_rgba(0,0,0,0.6)] transition hover:scale-[1.03]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40",
            className
          )}
          aria-label="Mở liên hệ"
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-black/20" />
          <PhoneCall className="h-6 w-6" />
        </button>
      </Popover.Trigger>

      {/* Content: Panel liên hệ, render bằng Portal nên không bị giới hạn container */}
      <Popover.Portal>
        <Popover.Content
          // canh về bên trái của trigger (vì trigger ở cạnh phải)
          side="left"
          align="center"
          sideOffset={12}
          className={clsx(
            "w-72 rounded-2xl border border-neutral-200 bg-white shadow-xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
          )}
        >
          <div className="flex items-center justify-between px-4 pt-3">
            <p className="text-sm font-semibold">{label}</p>
            <Popover.Close
              className="rounded p-1 text-neutral-500 hover:bg-neutral-100"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </Popover.Close>
          </div>

          <div className="px-3 pb-3 pt-1">
            <ul className="space-y-2">
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50"
                >
                  <span className="grid h-9 w-9 place-content-center rounded-full bg-black text-white">
                    <PhoneCall className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">Gọi ngay</div>
                    <div className="truncate text-xs text-neutral-600">
                      {phone}
                    </div>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50"
                >
                  <span className="grid h-9 w-9 place-content-center rounded-full bg-[#0866FF] text-white">
                    <FacebookIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">Facebook</div>
                    <div className="text-xs text-neutral-600">
                      Nhắn tin Fanpage
                    </div>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50"
                >
                  <span className="grid h-9 w-9 place-content-center rounded-full bg-[#0068FF] text-white">
                    <ZaloIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">Zalo</div>
                    <div className="text-xs text-neutral-600">
                      Chat ngay với shop
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* mũi tên nhỏ nếu muốn */}
          {/* <Popover.Arrow className="fill-white drop-shadow" /> */}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
