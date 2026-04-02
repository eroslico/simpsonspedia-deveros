interface Character {
  id: number;
  name: string;
  image: string;
  gender?: string;
  occupation?: string;
}

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <p className="text-sm font-heading text-foreground mt-2 truncate group-hover:text-primary transition-colors">
        {character.name}
      </p>
      {character.occupation && (
        <p className="text-xs text-muted-foreground truncate">
          {character.occupation}
        </p>
      )}
    </div>
  );
}
