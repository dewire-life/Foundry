# delete-account Edge Function

## Status: NOT deployed yet — this is source code, not a live endpoint.

This is a Supabase **Edge Function** (serverless Deno code that runs on
Supabase's servers). It is NOT bundled into the iOS app and is NOT a static
web file. The app calls it as an HTTPS API endpoint:

    POST {SUPABASE_URL}/functions/v1/delete-account

`sync.js` -> `deleteAccountCloud()` already makes this call with the signed-in
user's JWT, and the "Delete Account" button in Settings -> Danger Zone triggers
it. Until you deploy the function, that button will fail with a network error,
because the endpoint doesn't exist yet.

## Why it must live server-side

Deleting an auth user requires the Supabase **service_role** key, which bypasses
all row-level security and must never be shipped in the app. The function holds
that key server-side (the platform injects it automatically) and only ever
deletes the caller identified by their JWT, so a user can only delete themselves.

## Deploy it once (Supabase CLI, in your Mac Terminal)

From your project root (the folder containing this `supabase/` directory):

    brew install supabase/tap/supabase   # if you don't have the CLI yet
    supabase login                        # opens a browser to authorise
    supabase functions deploy delete-account --project-ref zowownchshnwficvjsgq

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided by the platform; you
do not set them by hand.

## Verify

Sign in on a throwaway account in the app, tap Delete Account. It should sign you
out and return to the welcome screen, and the user should disappear from
Authentication -> Users in the Supabase dashboard.
