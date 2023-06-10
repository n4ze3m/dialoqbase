type Props = {
  mode: string | undefined | null;
  children: React.ReactNode;
};

export const ModeSwitcher: React.FC<Props> = ({ mode, children }) => {
  if (!mode) {
    return <div className="flex bg-white flex-col min-h-screen px-8 mx-auto max-w-7xl">{children}</div>
  }
  return (
    <div className="flex bg-white flex-col min-h-screen">{children}</div>
  );
};
