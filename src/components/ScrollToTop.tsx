export function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="text-center py-8">
      <button
        onClick={scrollToTop}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Back to top
      </button>
    </div>
  );
}
