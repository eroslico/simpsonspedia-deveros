export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="container mx-auto px-4 flex flex-col items-center gap-2">
        <div className="w-6 h-0.5 bg-primary rounded-full" />
        <p className="text-xs text-muted-foreground">
          Simpsonspedia — Not affiliated with Fox or Disney. {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
