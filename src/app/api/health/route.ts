export async function GET() {
  return Response.json({
    ok: true,
    service: "ai-learning-platform",
    time: new Date().toISOString(),
  });
}

