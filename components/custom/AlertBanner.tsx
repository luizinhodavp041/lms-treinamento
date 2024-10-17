import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, TriangleAlert } from "lucide-react";

interface AlertBannerProps {
  isCompleted: boolean;
  requiredFieldsCount: number;
  missingFieldsCount: number;
}

const AlertBanner = ({
  isCompleted,
  requiredFieldsCount,
  missingFieldsCount,
}: AlertBannerProps) => {
  return (
    <Alert
      className="my-4"
      variant={`${isCompleted ? "complete" : "destructive"}`}
    >
      {isCompleted ? (
        <Rocket className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      <AlertTitle className="text-xs font-medium">
        {missingFieldsCount} campo(s) faltando / {requiredFieldsCount} campos
        obrigatórios
      </AlertTitle>
      <AlertDescription className="text-xs">
        {isCompleted
          ? "Bom trabalho! Pronto para publicar"
          : "Você só pode publicar quando todos os campos forem preenchidos"}
      </AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
