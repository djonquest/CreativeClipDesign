import { AuthHeader } from "@/components/layout/auth-header";
import { AuthForm } from "@/components/auth/auth-form";

export default function CadastroPage() {
  return (
    <div className="min-h-screen">
      <AuthHeader />
      <div className="px-6 pb-8 pt-4">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
