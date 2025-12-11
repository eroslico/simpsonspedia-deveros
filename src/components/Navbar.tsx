import { Link, useLocation } from "react-router-dom";
import { Users, Tv, MapPin, Home, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useFavorites } from "@/hooks/useFavorites";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Characters", path: "/characters", icon: Users },
  { name: "Episodes", path: "/episodes", icon: Tv },
  { name: "Locations", path: "/locations", icon: MapPin },
];

export function Navbar() {
  const location = useLocation();
  const { totalFavorites } = useFavorites();

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground text-shadow-sm group-hover:animate-wiggle">
              🍩 Simpsonspedia
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-heading font-medium transition-all duration-200",
                    isActive
                      ? "bg-secondary text-secondary-foreground shadow-md"
                      : "text-primary-foreground hover:bg-primary-foreground/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Favorites indicator */}
            <Link
              to="/favorites"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-heading font-medium transition-all duration-200 relative",
                location.pathname === "/favorites"
                  ? "bg-secondary text-secondary-foreground shadow-md"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              <Heart className="w-5 h-5" />
              Favorites
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                  {totalFavorites > 99 ? "99+" : totalFavorites}
                </span>
              )}
            </Link>

            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-primary-foreground hover:bg-primary-foreground/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
            
            {/* Mobile favorites */}
            <Link
              to="/favorites"
              className={cn(
                "p-2 rounded-lg transition-all duration-200 relative",
                location.pathname === "/favorites"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              <Heart className="w-5 h-5" />
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalFavorites > 9 ? "9+" : totalFavorites}
                </span>
              )}
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
