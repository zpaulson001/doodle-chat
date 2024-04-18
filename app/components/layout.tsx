type LayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className={`h-screen w-full bg-emerald-200 ${className}`}>
      {children}
    </div>
  );
}
