import { CardWrapper } from "./card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      headerTitle="Error"
    >
      <div className="flex items-center justify-center text-destructive">
        <FaExclamationTriangle className="h-8 w-8" />
      </div>
    </CardWrapper>
  );
};
