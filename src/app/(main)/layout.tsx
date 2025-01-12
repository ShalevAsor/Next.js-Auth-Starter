import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Navbar } from "@/app/(main)/_components/navbar";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col gap-y-10 items-center justify-center bg-sky-500">
        {children}
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
