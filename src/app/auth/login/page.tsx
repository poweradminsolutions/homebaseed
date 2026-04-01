import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-muted">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
