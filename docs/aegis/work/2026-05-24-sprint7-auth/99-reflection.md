# Sprint 7 Reflection

Sprint 7 changed the default access boundary without removing the current demo workflow. The important behavior change is that production no longer reaches `demo-user` implicitly just because Supabase is not configured. Access to demo data now requires an explicit Demo Session, and production must opt into showing that path with `ALLOW_DEMO_USER=true`.

The next hardening step is to configure a real Supabase project and eventually turn `ALLOW_DEMO_USER` off in production. Until then, the current state is safer than the old public fallback because direct access to learning pages redirects to `/login`.
