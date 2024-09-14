type LayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className={`h-screen w-full bg-emerald-100 ${className}`}>
      {children}
    </div>
  );
}
