import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function AppShell({
  activePath,
  title,
  actions,
  children,
}: {
  activePath: string;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full bg-background">
      <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="text-sm font-semibold">Roky Learn</div>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          {APP_ROUTES.map((r) => {
            const isActive = activePath === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b bg-background px-4">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{title}</div>
          </div>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

