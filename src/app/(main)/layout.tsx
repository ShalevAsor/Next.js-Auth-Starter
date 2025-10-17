import { Navbar } from "./_components/navbar";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-sky-500">
      <div className="w-full flex justify-center pt-6">
        <Navbar />
      </div>
      <div className="flex-1 flex items-center justify-center py-10">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
