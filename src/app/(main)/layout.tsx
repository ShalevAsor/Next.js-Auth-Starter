const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col gap-y-10 items-center justify-center bg-sky-500">
      {children}
    </div>
  );
};

export default ProtectedLayout;
