import { env } from "@/lib/env";
import { runDailyCronForUsers, verifyCronSecret } from "@/server/cron/daily";

export const dynamic = "force-dynamic";

async function handleDailyCron(request: Request) {
  if (!verifyCronSecret({ request, expectedSecret: env.CRON_SECRET })) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDailyCronForUsers();
  return Response.json(result, { status: result.ok ? 200 : 207 });
}

export async function GET(request: Request) {
  return handleDailyCron(request);
}

export async function POST(request: Request) {
  return handleDailyCron(request);
}

