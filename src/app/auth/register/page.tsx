import { RegisterForm } from "@/components/auth/register-from";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
};

export default RegisterPage;
