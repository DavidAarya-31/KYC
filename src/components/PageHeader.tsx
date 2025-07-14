interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      {children}
    </div>
  );
}