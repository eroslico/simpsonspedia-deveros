import { MapPin } from "lucide-react";

interface Location {
  id: number;
  name: string;
  image?: string;
  town?: string;
}

interface LocationCardProps {
  location: Location;
  onClick?: () => void;
}

export function LocationCard({ location, onClick }: LocationCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="aspect-video overflow-hidden rounded-lg border border-border bg-muted">
        {location.image ? (
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <p className="text-sm font-heading text-foreground mt-2 truncate group-hover:text-primary transition-colors">
        {location.name}
      </p>
      {location.town && (
        <p className="text-xs text-muted-foreground truncate">
          {location.town}
        </p>
      )}
    </div>
  );
}
