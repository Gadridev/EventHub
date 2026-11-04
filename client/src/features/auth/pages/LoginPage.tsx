import { LoginArtwork } from "../components/LoginArtwork";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <main className="grid min-h-dvh md:grid-cols-[1.073fr_1fr]">
      <LoginArtwork />
      <section className="flex items-center justify-center p-8">
        <LoginForm />
      </section>
    </main>
  );
}
