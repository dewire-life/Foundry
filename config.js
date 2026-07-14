// Deployment configuration. The anon public key is designed to be shipped in
// client-side code; row level security keeps each account's data private.
const FOUNDRY_CONFIG = {
  supabaseUrl: "https://zowownchshnwficvjsgq.supabase.co",
  // Optional tip jar. On the open web this link opens (Buy Me a Coffee etc.).
  // In a native App Store build, expose window.FoundryIAP from the shell and
  // the button runs an Apple in-app purchase instead; this URL is ignored
  // there, keeping the App Store build free of external payment links.
  supportUrl: "",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvd293bmNoc2hud2ZpY3Zqc2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzE2NjcsImV4cCI6MjA5OTMwNzY2N30.FdiTw_lLMT-4ULAX7KzrxQmTVMpfhag7FGFMmRqP2Ig"
};
