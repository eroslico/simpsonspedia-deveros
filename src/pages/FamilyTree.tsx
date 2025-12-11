import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  X,
  Heart,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FamilyMember {
  id: string;
  name: string;
  image: string;
  role: string;
  generation: number;
  x: number;
  y: number;
  connections: string[];
  info?: {
    occupation?: string;
    age?: string;
    voiceActor?: string;
  };
}

const simpsonFamily: FamilyMember[] = [
  // Generation 0 - Grandparents
  {
    id: "abe",
    name: "Abraham Simpson",
    image: "👴",
    role: "Grandfather",
    generation: 0,
    x: 200,
    y: 50,
    connections: ["homer"],
    info: { occupation: "Retired", age: "83+", voiceActor: "Dan Castellaneta" },
  },
  {
    id: "mona",
    name: "Mona Simpson",
    image: "👵",
    role: "Grandmother",
    generation: 0,
    x: 350,
    y: 50,
    connections: ["homer"],
    info: { occupation: "Activist", age: "Deceased", voiceActor: "Glenn Close" },
  },
  {
    id: "clancy",
    name: "Clancy Bouvier",
    image: "👴",
    role: "Grandfather",
    generation: 0,
    x: 550,
    y: 50,
    connections: ["marge"],
    info: { occupation: "Flight Attendant", age: "Deceased", voiceActor: "Various" },
  },
  {
    id: "jacqueline",
    name: "Jacqueline Bouvier",
    image: "👵",
    role: "Grandmother",
    generation: 0,
    x: 700,
    y: 50,
    connections: ["marge", "patty", "selma"],
    info: { occupation: "Retired", age: "80+", voiceActor: "Julie Kavner" },
  },
  // Generation 1 - Parents
  {
    id: "homer",
    name: "Homer Simpson",
    image: "👨",
    role: "Father",
    generation: 1,
    x: 300,
    y: 180,
    connections: ["bart", "lisa", "maggie"],
    info: { occupation: "Safety Inspector", age: "39", voiceActor: "Dan Castellaneta" },
  },
  {
    id: "marge",
    name: "Marge Simpson",
    image: "👩",
    role: "Mother",
    generation: 1,
    x: 450,
    y: 180,
    connections: ["bart", "lisa", "maggie"],
    info: { occupation: "Homemaker", age: "36", voiceActor: "Julie Kavner" },
  },
  {
    id: "patty",
    name: "Patty Bouvier",
    image: "👩",
    role: "Aunt",
    generation: 1,
    x: 600,
    y: 180,
    connections: [],
    info: { occupation: "DMV Worker", age: "43", voiceActor: "Julie Kavner" },
  },
  {
    id: "selma",
    name: "Selma Bouvier",
    image: "👩",
    role: "Aunt",
    generation: 1,
    x: 750,
    y: 180,
    connections: ["ling"],
    info: { occupation: "DMV Worker", age: "43", voiceActor: "Julie Kavner" },
  },
  // Generation 2 - Children
  {
    id: "bart",
    name: "Bart Simpson",
    image: "👦",
    role: "Son",
    generation: 2,
    x: 250,
    y: 320,
    connections: [],
    info: { occupation: "Student", age: "10", voiceActor: "Nancy Cartwright" },
  },
  {
    id: "lisa",
    name: "Lisa Simpson",
    image: "👧",
    role: "Daughter",
    generation: 2,
    x: 375,
    y: 320,
    connections: [],
    info: { occupation: "Student", age: "8", voiceActor: "Yeardley Smith" },
  },
  {
    id: "maggie",
    name: "Maggie Simpson",
    image: "👶",
    role: "Daughter",
    generation: 2,
    x: 500,
    y: 320,
    connections: [],
    info: { occupation: "Baby", age: "1", voiceActor: "Various" },
  },
  {
    id: "ling",
    name: "Ling Bouvier",
    image: "👶",
    role: "Adopted Cousin",
    generation: 2,
    x: 750,
    y: 320,
    connections: [],
    info: { occupation: "Baby", age: "1", voiceActor: "Nancy Cartwright" },
  },
];

// Marriage connections
const marriages = [
  { from: "abe", to: "mona" },
  { from: "clancy", to: "jacqueline" },
  { from: "homer", to: "marge" },
];

export default function FamilyTree() {
  const [zoom, setZoom] = useState(1);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('.tree-container')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Simpson Family Tree"
            subtitle="Explore the family connections of Springfield's most famous family"
            icon="🌳"
          />

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-card border-2 border-border rounded-lg hover:bg-muted transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 bg-card border-2 border-border rounded-lg font-heading text-sm">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-card border-2 border-border rounded-lg hover:bg-muted transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-card border-2 border-border rounded-lg hover:bg-muted transition-colors"
              aria-label="Reset view"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Tree Container */}
          <div
            ref={containerRef}
            className="relative bg-card rounded-3xl border-4 border-border shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ height: "500px" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Generation labels */}
            <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-around text-xs font-heading text-muted-foreground z-10 pointer-events-none">
              <span>Grandparents</span>
              <span>Parents</span>
              <span>Children</span>
            </div>

            {/* Tree */}
            <div
              className="tree-container absolute inset-0"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
            >
              {/* SVG for connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Parent-child connections */}
                {simpsonFamily.map((member) =>
                  member.connections.map((childId) => {
                    const child = simpsonFamily.find((m) => m.id === childId);
                    if (!child) return null;
                    return (
                      <line
                        key={`${member.id}-${childId}`}
                        x1={member.x + 40}
                        y1={member.y + 80}
                        x2={child.x + 40}
                        y2={child.y}
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                      />
                    );
                  })
                )}
                
                {/* Marriage connections */}
                {marriages.map((marriage) => {
                  const from = simpsonFamily.find((m) => m.id === marriage.from);
                  const to = simpsonFamily.find((m) => m.id === marriage.to);
                  if (!from || !to) return null;
                  return (
                    <g key={`marriage-${marriage.from}-${marriage.to}`}>
                      <line
                        x1={from.x + 80}
                        y1={from.y + 40}
                        x2={to.x}
                        y2={to.y + 40}
                        stroke="hsl(var(--accent))"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <text
                        x={(from.x + to.x) / 2 + 40}
                        y={from.y + 35}
                        fill="hsl(var(--accent))"
                        fontSize="16"
                        textAnchor="middle"
                      >
                        💕
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Family members */}
              {simpsonFamily.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={cn(
                    "absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 flex flex-col items-center justify-center transition-all hover:scale-110 hover:shadow-lg",
                    selectedMember?.id === member.id
                      ? "border-primary shadow-lg scale-110"
                      : "border-border"
                  )}
                  style={{ left: member.x, top: member.y }}
                >
                  <span className="text-3xl">{member.image}</span>
                  <span className="text-[10px] font-heading text-foreground truncate w-full px-1 text-center">
                    {member.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-body bg-background/80 px-3 py-1 rounded-full">
              Drag to pan • Click member for details
            </div>
          </div>

          {/* Selected Member Details */}
          {selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
              <div className="bg-card rounded-3xl p-6 border-4 border-primary shadow-2xl max-w-md w-full animate-bounce-in">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{selectedMember.image}</span>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground">
                        {selectedMember.name}
                      </h3>
                      <p className="text-sm text-primary font-heading">{selectedMember.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedMember.info && (
                  <div className="space-y-2 mb-4">
                    {selectedMember.info.occupation && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground font-body">Occupation:</span>
                        <span className="font-heading text-foreground">{selectedMember.info.occupation}</span>
                      </div>
                    )}
                    {selectedMember.info.age && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground font-body">Age:</span>
                        <span className="font-heading text-foreground">{selectedMember.info.age}</span>
                      </div>
                    )}
                    {selectedMember.info.voiceActor && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground font-body">Voice Actor:</span>
                        <span className="font-heading text-foreground">{selectedMember.info.voiceActor}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedMember.connections.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground font-body mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {selectedMember.generation < 2 ? "Children:" : "Parents:"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.connections.map((connId) => {
                        const conn = simpsonFamily.find((m) => m.id === connId);
                        return conn ? (
                          <span
                            key={connId}
                            className="px-3 py-1 bg-muted rounded-full text-sm font-heading"
                          >
                            {conn.image} {conn.name.split(" ")[0]}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-8 bg-card rounded-2xl p-4 border-2 border-border">
            <h3 className="font-heading font-bold text-foreground mb-3">Legend</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-border" />
                <span className="text-muted-foreground font-body">Parent-Child</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-accent border-dashed border-t-2 border-accent" />
                <span className="text-muted-foreground font-body">Marriage</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground font-body">Married Couple</span>
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

