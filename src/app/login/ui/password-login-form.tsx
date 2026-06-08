"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { startPasswordSessionAction } from "../actions";

const passwordLoginCtaClassName = "min-h-11 w-full sm:w-auto";
const passwordLoginInputClassName = "min-h-11";

export function PasswordLoginForm({ next }: { next: string }) {
  const initialState = { message: null as string | null };
  const [state, formAction, pending] = useActionState(
    startPasswordSessionAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="next" value={next} />
      <div className="grid gap-2">
        <div className="text-sm font-medium">访问密码</div>
        <Input
          type="password"
          name="password"
          placeholder="输入共享访问密码"
          autoComplete="current-password"
          className={passwordLoginInputClassName}
          required
        />
      </div>
      <Button type="submit" disabled={pending} className={passwordLoginCtaClassName}>
        用访问密码进入
      </Button>
      {state.message ? <div className="text-sm text-muted-foreground">{state.message}</div> : null}
    </form>
  );
}
