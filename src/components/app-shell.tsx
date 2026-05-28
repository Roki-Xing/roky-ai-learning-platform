import Link from "next/link";
import { APP_ROUTE_GROUPS } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function NavLinks(props: {
  activePath: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-4 p-3">
      {APP_ROUTE_GROUPS.map((group) => (
        <div key={group.label} className="grid gap-1">
          <div className="px-2 text-xs font-medium text-muted-foreground">
            {group.label}
          </div>
          <div className="grid gap-1">
            {group.routes.map((r) => {
              const isActive = props.activePath === r.href;
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  onClick={props.onNavigate}
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
          </div>
        </div>
      ))}
    </nav>
  );
}

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
        <NavLinks activePath={activePath} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b bg-background px-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="打开菜单">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="flex h-14 items-center gap-2 border-b px-4">
                    <div className="text-sm font-semibold">Roky Learn</div>
                  </div>
                  <NavLinks activePath={activePath} />
                </SheetContent>
              </Sheet>
            </div>

            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{title}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
