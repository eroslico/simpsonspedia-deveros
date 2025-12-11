import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Animation */}
            <div className="relative mb-8">
              <div className="text-[150px] md:text-[200px] font-heading font-bold text-primary/20 leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl md:text-9xl animate-bounce">🍩</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              D'oh! Page Not Found
            </h1>
            
            <p className="text-lg text-muted-foreground font-body mb-8 max-w-md mx-auto">
              Looks like Homer ate this page... or it never existed in the first place!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full px-8"
              >
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="font-heading rounded-full px-8 border-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Fun quote */}
            <div className="mt-16 p-6 bg-muted/50 rounded-2xl border border-border">
              <p className="text-muted-foreground font-body italic">
                "Trying is the first step towards failure."
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2 font-heading">
                — Homer Simpson
              </p>
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
};

export default NotFound;
