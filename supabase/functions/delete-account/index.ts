// Supabase Edge Function: delete-account
//
// Deletes the calling user's data and their auth account. Account removal
// requires the service_role key, which must never reach the browser, so it
// lives only here on the server. The function trusts nothing from the client
// except a valid JWT: it derives the user id from that token, so a caller can
// only ever delete themselves.
//
// Deploy (from the repo root, one time):
//   supabase functions deploy delete-account --project-ref zowownchshnwficvjsgq
// The SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY vars are injected automatically
// by the platform; no secrets to set by hand.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Resolve the user strictly from their token; the client cannot name someone else.
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    // Remove their rows first. Both tables also cascade on auth-user deletion,
    // so this is belt-and-braces, and it clears the leaderboard immediately.
    await admin.from("foundry_state").delete().eq("user_id", userId);
    await admin.from("foundry_leaderboard").delete().eq("user_id", userId);

    // Finally delete the auth account itself.
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), {
        status: 500, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
