import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalSearch } from "./GlobalSearch";

const navItems = [
  { name: "Characters", path: "/characters" },
  { name: "Episodes", path: "/episodes" },
  { name: "Locations", path: "/locations" },
  { name: "Favorites", path: "/favorites" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-0">
              <span className="text-lg font-heading text-foreground">Simpson</span>
              <span className="text-lg font-heading text-primary">s</span>
              <span className="text-lg font-heading text-foreground">pedia</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-sm transition-colors relative py-1",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-1">
              <GlobalSearch />
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col">
          <div className="flex items-center justify-between h-14 px-4 border-b border-border">
            <span className="text-lg font-heading text-foreground">
              Simpson<span className="text-primary">s</span>pedia
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col items-start px-6 pt-12 gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-3xl font-heading transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="block w-8 h-0.5 bg-primary mt-1 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
