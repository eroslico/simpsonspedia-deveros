import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-heading text-foreground mb-2">
          404 — Page not found.
        </h1>
        <p className="text-sm text-muted-foreground">
          <Link to="/" className="underline hover:text-foreground transition-colors">
            Go home
          </Link>
        </p>
      </main>
    </div>
  );
};

export default NotFound;
