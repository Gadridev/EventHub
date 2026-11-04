import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Fields";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, loginError } = useAuth();
  const message = loginError
    ? getApiErrorMessage(loginError, "Unable to sign in. Please try again.")
    : "";

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function togglePasswordVisibility() {
    setShowPassword((visible) => !visible);
  }

   function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoggingIn) {
      return;
    }

       login(email.trim(), password);
    
  }

  return (
    <div className="w-full max-w-[360px] md:translate-y-8">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-[30px]">Sign in</h2>
        <Input
          label="Email"
          type="email"
          autoComplete="username"
          placeholder="admin@eventhub.ma"
          required
          value={email}
          onChange={handleEmailChange}
        />
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <Button
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
        {message && (
          <p role="alert" className="rounded-lg bg-danger-bg p-3 text-danger">
            {message}
          </p>
        )}
        <Button primary type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
