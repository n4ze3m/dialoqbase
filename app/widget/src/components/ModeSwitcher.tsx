type Props = {
  mode: string | undefined | null;
  children: React.ReactNode;
};

export const ModeSwitcher: React.FC<Props> = ({ mode, children }) => {
  if (!mode) {
    
    return <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
  }

  return (
    <>{children}</>
  );
};
