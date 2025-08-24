import AuthGate from "@/components/AuthGate";
import BirthForm from "@/components/BirthForm";

export default function Page() {
  return (
    <AuthGate>
      <BirthForm />
    </AuthGate>
  );
}
