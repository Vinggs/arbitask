export default function Header({ title }: { title: string }) {
  return (
    <header className="flex items-center h-[80px] min-h-[80px] max-h-[80px] shrink-0 bg-surface-container-lowest border-b border-outline-variant px-margin-desktop sticky top-0 z-40 box-border overflow-hidden">
      <h1 className="font-headline-lg text-primary truncate">{title}</h1>
    </header>
  );
}
