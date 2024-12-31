"use client";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisterForm } from "@/components/auth/register-from";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; //

interface RegisterButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const RegisterButton = ({
  children,
  mode = "redirect",
  asChild,
}: RegisterButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/register");
  };
  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto border-none">
          <VisuallyHidden>
            <DialogTitle>Register</DialogTitle>
          </VisuallyHidden>
          <RegisterForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
