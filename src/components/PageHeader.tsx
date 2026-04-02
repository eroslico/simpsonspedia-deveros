interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number | string;
}

export function PageHeader({ title, subtitle, count }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {count !== undefined && (
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
          {count} {title.toLowerCase()}
        </p>
      )}
      <h1 className="text-3xl md:text-4xl font-heading text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
