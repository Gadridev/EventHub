import { useState } from "react";
import { Outlet } from "react-router";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Brand } from "./Brand";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
export function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="fixed left-4 top-2 z-50 -translate-y-24 rounded bg-accent p-3 text-page focus:translate-y-0"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 hidden w-[236px] md:block">
        <Sidebar />
      </aside>
      <div className="flex items-center justify-between bg-sidebar p-4 md:hidden">
        <Brand />
        <Button aria-label="Open navigation" onClick={() => setOpen(true)}>
          <Menu size={20} />
        </Button>
      </div>
      {open && (
        <Modal title="Navigation" onClose={() => setOpen(false)}>
          <Sidebar onNavigate={() => setOpen(false)} />
        </Modal>
      )}
      <main
        id="main"
        className="flex min-h-dvh flex-col gap-6 p-5 md:ml-[236px] md:p-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
