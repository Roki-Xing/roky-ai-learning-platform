"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithEmailLink } from "../actions";

const emailLoginCtaClassName = "min-h-11 w-full sm:w-auto";
const emailLoginInputClassName = "min-h-11";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(null);
        startTransition(async () => {
          const res = await signInWithEmailLink({ email, next });
          if (!res.ok) setMessage(res.message);
          else setMessage("已发送登录链接，请查收邮箱。");
        });
      }}
    >
      <div className="grid gap-2">
        <div className="text-sm font-medium">邮箱</div>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className={emailLoginInputClassName}
          required
        />
      </div>
      <Button type="submit" disabled={pending || !email} className={emailLoginCtaClassName}>
        发送登录链接
      </Button>
      {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
    </form>
  );
}
