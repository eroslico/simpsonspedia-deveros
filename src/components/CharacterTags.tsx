import { cn } from "@/lib/utils";

interface CharacterTagsProps {
  characterName: string;
  className?: string;
}

// Character family/category mappings
const CHARACTER_TAGS: Record<string, { label: string; color: string; emoji: string }[]> = {
  // Simpson Family
  "Homer Simpson": [
    { label: "Simpson Family", color: "bg-primary", emoji: "👨‍👩‍👧‍👦" },
    { label: "Nuclear Plant", color: "bg-simpsons-green", emoji: "☢️" },
  ],
  "Marge Simpson": [
    { label: "Simpson Family", color: "bg-primary", emoji: "👨‍👩‍👧‍👦" },
    { label: "Housewife", color: "bg-simpsons-pink", emoji: "🏠" },
  ],
  "Bart Simpson": [
    { label: "Simpson Family", color: "bg-primary", emoji: "👨‍👩‍👧‍👦" },
    { label: "Student", color: "bg-simpsons-orange", emoji: "🎒" },
    { label: "Troublemaker", color: "bg-destructive", emoji: "😈" },
  ],
  "Lisa Simpson": [
    { label: "Simpson Family", color: "bg-primary", emoji: "👨‍👩‍👧‍👦" },
    { label: "Student", color: "bg-simpsons-orange", emoji: "🎒" },
    { label: "Genius", color: "bg-secondary", emoji: "🎷" },
  ],
  "Maggie Simpson": [
    { label: "Simpson Family", color: "bg-primary", emoji: "👨‍👩‍👧‍👦" },
    { label: "Baby", color: "bg-simpsons-pink", emoji: "👶" },
  ],
  
  // Flanders Family
  "Ned Flanders": [
    { label: "Flanders Family", color: "bg-simpsons-green", emoji: "✝️" },
    { label: "Neighbor", color: "bg-secondary", emoji: "🏠" },
  ],
  "Rod Flanders": [
    { label: "Flanders Family", color: "bg-simpsons-green", emoji: "✝️" },
  ],
  "Todd Flanders": [
    { label: "Flanders Family", color: "bg-simpsons-green", emoji: "✝️" },
  ],
  
  // School Staff
  "Principal Skinner": [
    { label: "School Staff", color: "bg-simpsons-orange", emoji: "🏫" },
    { label: "Principal", color: "bg-secondary", emoji: "👔" },
  ],
  "Edna Krabappel": [
    { label: "School Staff", color: "bg-simpsons-orange", emoji: "🏫" },
    { label: "Teacher", color: "bg-secondary", emoji: "📚" },
  ],
  "Groundskeeper Willie": [
    { label: "School Staff", color: "bg-simpsons-orange", emoji: "🏫" },
    { label: "Groundskeeper", color: "bg-simpsons-green", emoji: "🧹" },
  ],
  
  // Nuclear Plant
  "Mr. Burns": [
    { label: "Nuclear Plant", color: "bg-simpsons-green", emoji: "☢️" },
    { label: "Owner", color: "bg-primary", emoji: "💰" },
    { label: "Villain", color: "bg-destructive", emoji: "😈" },
  ],
  "Waylon Smithers": [
    { label: "Nuclear Plant", color: "bg-simpsons-green", emoji: "☢️" },
    { label: "Assistant", color: "bg-secondary", emoji: "📋" },
  ],
  "Lenny Leonard": [
    { label: "Nuclear Plant", color: "bg-simpsons-green", emoji: "☢️" },
    { label: "Worker", color: "bg-muted", emoji: "👷" },
  ],
  "Carl Carlson": [
    { label: "Nuclear Plant", color: "bg-simpsons-green", emoji: "☢️" },
    { label: "Worker", color: "bg-muted", emoji: "👷" },
  ],
  
  // Moe's Tavern
  "Moe Szyslak": [
    { label: "Moe's Tavern", color: "bg-simpsons-brown", emoji: "🍺" },
    { label: "Bartender", color: "bg-secondary", emoji: "🍸" },
  ],
  "Barney Gumble": [
    { label: "Moe's Tavern", color: "bg-simpsons-brown", emoji: "🍺" },
    { label: "Regular", color: "bg-muted", emoji: "🍻" },
  ],
  
  // Police
  "Chief Wiggum": [
    { label: "Police", color: "bg-simpsons-blue", emoji: "👮" },
    { label: "Chief", color: "bg-secondary", emoji: "⭐" },
  ],
  "Lou": [
    { label: "Police", color: "bg-simpsons-blue", emoji: "👮" },
  ],
  "Eddie": [
    { label: "Police", color: "bg-simpsons-blue", emoji: "👮" },
  ],
  
  // Krusty Show
  "Krusty the Clown": [
    { label: "Krusty Show", color: "bg-simpsons-pink", emoji: "🤡" },
    { label: "Entertainer", color: "bg-primary", emoji: "🎪" },
  ],
  "Sideshow Bob": [
    { label: "Krusty Show", color: "bg-simpsons-pink", emoji: "🤡" },
    { label: "Villain", color: "bg-destructive", emoji: "😈" },
  ],
  "Sideshow Mel": [
    { label: "Krusty Show", color: "bg-simpsons-pink", emoji: "🤡" },
  ],
  
  // Kwik-E-Mart
  "Apu Nahasapeemapetilon": [
    { label: "Kwik-E-Mart", color: "bg-simpsons-orange", emoji: "🏪" },
    { label: "Owner", color: "bg-primary", emoji: "💼" },
  ],
  
  // Medical
  "Dr. Hibbert": [
    { label: "Medical", color: "bg-secondary", emoji: "🏥" },
    { label: "Doctor", color: "bg-simpsons-blue", emoji: "👨‍⚕️" },
  ],
  "Dr. Nick": [
    { label: "Medical", color: "bg-secondary", emoji: "🏥" },
    { label: "Doctor", color: "bg-destructive", emoji: "💉" },
  ],
  
  // Media
  "Kent Brockman": [
    { label: "Media", color: "bg-secondary", emoji: "📺" },
    { label: "News Anchor", color: "bg-primary", emoji: "🎤" },
  ],
  
  // Bullies
  "Nelson Muntz": [
    { label: "Student", color: "bg-simpsons-orange", emoji: "🎒" },
    { label: "Bully", color: "bg-destructive", emoji: "👊" },
  ],
  "Jimbo Jones": [
    { label: "Student", color: "bg-simpsons-orange", emoji: "🎒" },
    { label: "Bully", color: "bg-destructive", emoji: "👊" },
  ],
  
  // Bart's Friends
  "Milhouse Van Houten": [
    { label: "Student", color: "bg-simpsons-orange", emoji: "🎒" },
    { label: "Bart's Friend", color: "bg-secondary", emoji: "🤝" },
  ],
  "Ralph Wiggum": [
    { label: "Student", color: "bg-simpsons-orange", emoji: "🎒" },
    { label: "Chief's Son", color: "bg-simpsons-blue", emoji: "👮" },
  ],
};

// Fallback tags based on common patterns in names
function getDefaultTags(name: string): { label: string; color: string; emoji: string }[] {
  const tags: { label: string; color: string; emoji: string }[] = [];
  
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes("simpson")) {
    tags.push({ label: "Simpson Family", color: "bg-primary", emoji: "👨‍👩‍👧‍👦" });
  }
  if (nameLower.includes("flanders")) {
    tags.push({ label: "Flanders Family", color: "bg-simpsons-green", emoji: "✝️" });
  }
  if (nameLower.includes("dr.") || nameLower.includes("doctor")) {
    tags.push({ label: "Medical", color: "bg-secondary", emoji: "🏥" });
  }
  if (nameLower.includes("chief") || nameLower.includes("officer")) {
    tags.push({ label: "Police", color: "bg-simpsons-blue", emoji: "👮" });
  }
  
  return tags;
}

export function CharacterTags({ characterName, className }: CharacterTagsProps) {
  const tags = CHARACTER_TAGS[characterName] || getDefaultTags(characterName);
  
  if (tags.length === 0) return null;
  
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-heading",
            tag.color,
            tag.color.includes("primary") ? "text-primary-foreground" : 
            tag.color.includes("secondary") ? "text-secondary-foreground" :
            tag.color.includes("destructive") ? "text-destructive-foreground" :
            tag.color.includes("accent") ? "text-accent-foreground" :
            "text-foreground"
          )}
        >
          <span>{tag.emoji}</span>
          {tag.label}
        </span>
      ))}
    </div>
  );
}

export function getCharacterTags(characterName: string) {
  return CHARACTER_TAGS[characterName] || getDefaultTags(characterName);
}

