import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Prediction {
  id: number;
  title: string;
  description: string;
  episode: string;
  airDate: string;
  realizedDate?: string;
  status: "confirmed" | "pending" | "debunked";
  category: string;
  image?: string;
  votes: { up: number; down: number };
}

const predictions: Prediction[] = [
  {
    id: 1,
    title: "Donald Trump Presidency",
    description: "In the episode 'Bart to the Future' (2000), Lisa becomes president and mentions inheriting 'quite a budget crunch from President Trump.'",
    episode: "Bart to the Future (S11E17)",
    airDate: "2000-03-19",
    realizedDate: "2016-11-08",
    status: "confirmed",
    category: "Politics",
    votes: { up: 15420, down: 234 },
  },
  {
    id: 2,
    title: "Disney Buys 20th Century Fox",
    description: "In the 1998 episode 'When You Dish Upon a Star', a sign shows '20th Century Fox, A Division of Walt Disney Co.'",
    episode: "When You Dish Upon a Star (S10E5)",
    airDate: "1998-11-08",
    realizedDate: "2019-03-20",
    status: "confirmed",
    category: "Business",
    votes: { up: 12350, down: 156 },
  },
  {
    id: 3,
    title: "Smartwatches",
    description: "In 'Lisa's Wedding' (1995), a character is seen talking into his watch like a phone.",
    episode: "Lisa's Wedding (S6E19)",
    airDate: "1995-03-19",
    realizedDate: "2015-04-24",
    status: "confirmed",
    category: "Technology",
    votes: { up: 9870, down: 445 },
  },
  {
    id: 4,
    title: "Video Chat",
    description: "Multiple episodes showed video calling technology years before FaceTime and Skype became mainstream.",
    episode: "Various episodes",
    airDate: "1995-03-19",
    realizedDate: "2010-06-24",
    status: "confirmed",
    category: "Technology",
    votes: { up: 8920, down: 567 },
  },
  {
    id: 5,
    title: "Autocorrect Failures",
    description: "In 'Lisa on Ice' (1994), a Newton device hilariously misinterprets handwriting, predicting autocorrect issues.",
    episode: "Lisa on Ice (S6E8)",
    airDate: "1994-11-13",
    realizedDate: "2007-06-29",
    status: "confirmed",
    category: "Technology",
    votes: { up: 7650, down: 234 },
  },
  {
    id: 6,
    title: "Greece Economic Crisis",
    description: "A news ticker in 'Politically Inept, with Homer Simpson' (2012) showed 'Europe puts Greece on eBay'.",
    episode: "Politically Inept (S23E10)",
    airDate: "2012-01-08",
    realizedDate: "2015-07-01",
    status: "confirmed",
    category: "Economy",
    votes: { up: 6540, down: 890 },
  },
  {
    id: 7,
    title: "FIFA Corruption Scandal",
    description: "The episode showed corruption in FIFA years before the real scandal broke.",
    episode: "You Don't Have to Live Like a Referee (S25E16)",
    airDate: "2014-03-30",
    realizedDate: "2015-05-27",
    status: "confirmed",
    category: "Sports",
    votes: { up: 5430, down: 123 },
  },
  {
    id: 8,
    title: "Three-Eyed Fish",
    description: "Blinky, the three-eyed fish, appeared in 1990. In 2011, a three-eyed fish was found near a nuclear plant in Argentina.",
    episode: "Two Cars in Every Garage (S2E4)",
    airDate: "1990-11-01",
    realizedDate: "2011-10-11",
    status: "confirmed",
    category: "Environment",
    votes: { up: 4320, down: 678 },
  },
  {
    id: 9,
    title: "Farmville/Farm Games",
    description: "Lisa is seen playing a farming simulation game called 'Yard Work Simulator' in 1998.",
    episode: "Bart Carny (S9E12)",
    airDate: "1998-01-11",
    realizedDate: "2009-06-19",
    status: "confirmed",
    category: "Gaming",
    votes: { up: 3210, down: 234 },
  },
  {
    id: 10,
    title: "NSA Spying Scandal",
    description: "The Simpsons Movie (2007) showed the NSA monitoring citizens, years before Snowden revelations.",
    episode: "The Simpsons Movie",
    airDate: "2007-07-27",
    realizedDate: "2013-06-06",
    status: "confirmed",
    category: "Politics",
    votes: { up: 8760, down: 345 },
  },
  {
    id: 11,
    title: "Higgs Boson Equation",
    description: "Homer is seen writing an equation on a blackboard that comes close to predicting the mass of the Higgs boson.",
    episode: "The Wizard of Evergreen Terrace (S10E2)",
    airDate: "1998-09-20",
    realizedDate: "2012-07-04",
    status: "confirmed",
    category: "Science",
    votes: { up: 11230, down: 567 },
  },
  {
    id: 12,
    title: "Voting Machine Manipulation",
    description: "Homer tries to vote for Obama but the machine changes his vote, predicting concerns about electronic voting.",
    episode: "Treehouse of Horror XIX (S20E4)",
    airDate: "2008-11-02",
    status: "pending",
    category: "Politics",
    votes: { up: 4560, down: 1234 },
  },
];

export default function Predictions() {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending">("all");
  const [votes, setVotes] = useState<Record<number, { up: boolean; down: boolean }>>({});

  const filteredPredictions = predictions.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const handleVote = (id: number, type: "up" | "down") => {
    setVotes((prev) => ({
      ...prev,
      [id]: {
        up: type === "up" ? !prev[id]?.up : false,
        down: type === "down" ? !prev[id]?.down : false,
      },
    }));
  };

  const confirmedCount = predictions.filter((p) => p.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          <PageHeader
            title="Simpsons Predictions"
            subtitle="Explore the uncanny predictions The Simpsons got right"
            icon="🔮"
          />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center">
              <p className="text-3xl font-heading font-bold text-primary">{predictions.length}</p>
              <p className="text-sm text-muted-foreground font-body">Total Predictions</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center">
              <p className="text-3xl font-heading font-bold text-simpsons-green">{confirmedCount}</p>
              <p className="text-sm text-muted-foreground font-body">Confirmed</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center">
              <p className="text-3xl font-heading font-bold text-simpsons-orange">
                {predictions.filter((p) => p.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground font-body">Pending</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-md text-center">
              <p className="text-3xl font-heading font-bold text-secondary">35+</p>
              <p className="text-sm text-muted-foreground font-body">Years of Predictions</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { value: "all", label: "All", icon: Sparkles },
              { value: "confirmed", label: "Confirmed", icon: CheckCircle2 },
              { value: "pending", label: "Pending", icon: Clock },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as typeof filter)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-heading text-sm transition-all whitespace-nowrap",
                  filter === f.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border-2 border-border hover:border-primary"
                )}
              >
                <f.icon className="w-4 h-4" />
                {f.label}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

            {/* Predictions */}
            <div className="space-y-8">
              {filteredPredictions.map((prediction, index) => (
                <div
                  key={prediction.id}
                  className={cn(
                    "relative grid md:grid-cols-2 gap-4 md:gap-8",
                    index % 2 === 0 ? "md:text-right" : "md:flex-row-reverse"
                  )}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                  {/* Content */}
                  <div className={cn(
                    "ml-12 md:ml-0",
                    index % 2 === 0 ? "md:pr-8" : "md:col-start-2 md:pl-8 md:text-left"
                  )}>
                    <div className="bg-card rounded-2xl p-5 border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
                      {/* Status badge */}
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-heading mb-3",
                        prediction.status === "confirmed" && "bg-simpsons-green/20 text-simpsons-green",
                        prediction.status === "pending" && "bg-simpsons-orange/20 text-simpsons-orange",
                        prediction.status === "debunked" && "bg-destructive/20 text-destructive"
                      )}>
                        {prediction.status === "confirmed" && <CheckCircle2 className="w-3 h-3" />}
                        {prediction.status === "pending" && <Clock className="w-3 h-3" />}
                        {prediction.status.charAt(0).toUpperCase() + prediction.status.slice(1)}
                      </div>

                      <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                        {prediction.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground font-body mb-3">
                        {prediction.description}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Aired: {new Date(prediction.airDate).getFullYear()}
                        </span>
                        {prediction.realizedDate && (
                          <span className="flex items-center gap-1 text-simpsons-green">
                            <CheckCircle2 className="w-3 h-3" />
                            Realized: {new Date(prediction.realizedDate).getFullYear()}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-primary font-heading mb-3">
                        📺 {prediction.episode}
                      </p>

                      {/* Voting */}
                      <div className="flex items-center gap-3 pt-3 border-t border-border">
                        <button
                          onClick={() => handleVote(prediction.id, "up")}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-lg transition-colors",
                            votes[prediction.id]?.up
                              ? "bg-simpsons-green/20 text-simpsons-green"
                              : "hover:bg-muted"
                          )}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm font-heading">
                            {prediction.votes.up + (votes[prediction.id]?.up ? 1 : 0)}
                          </span>
                        </button>
                        <button
                          onClick={() => handleVote(prediction.id, "down")}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-lg transition-colors",
                            votes[prediction.id]?.down
                              ? "bg-destructive/20 text-destructive"
                              : "hover:bg-muted"
                          )}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span className="text-sm font-heading">
                            {prediction.votes.down + (votes[prediction.id]?.down ? 1 : 0)}
                          </span>
                        </button>
                        <span className="px-2 py-1 bg-muted rounded-lg text-xs font-heading text-muted-foreground ml-auto">
                          {prediction.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block" />
                </div>
              ))}
            </div>
          </div>

          {/* Fun fact */}
          <div className="mt-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl p-6 text-center border-2 border-primary/30">
            <span className="text-4xl mb-3 block">🔮</span>
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              How do they do it?
            </h3>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              The Simpsons writers are Harvard graduates and experts in various fields. 
              Many "predictions" are actually educated extrapolations of current trends, 
              combined with over 750 episodes covering virtually every topic imaginable!
            </p>
          </div>
        </main>
      </PageTransition>
      <ScrollToTop />
    </div>
  );
}

