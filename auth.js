// BPM Intelligence — Supabase client + session guard
// Requires: @supabase/supabase-js (UMD) and supabase-config.js loaded first.
(function () {
  if (!window.supabase || !window.BPM_CONFIG) {
    console.error('[BPM] Supabase SDK or config not loaded');
    return;
  }
  var sb = window.supabase.createClient(
    window.BPM_CONFIG.SUPABASE_URL,
    window.BPM_CONFIG.SUPABASE_KEY
  );
  window.sb = sb;

  // Protected pages call this early: redirect to login if there's no session.
  window.requireAuth = async function () {
    try {
      var res = await sb.auth.getSession();
      if (!res.data || !res.data.session) {
        window.location.replace('login.html');
        return null;
      }
      return res.data.session;
    } catch (e) {
      console.error('[BPM] auth check failed', e);
      window.location.replace('login.html');
      return null;
    }
  };

  // Login page calls this: if already signed in, skip straight to the app.
  window.redirectIfAuthed = async function () {
    try {
      var res = await sb.auth.getSession();
      if (res.data && res.data.session) window.location.replace('portfolio.html');
    } catch (e) { /* stay on login */ }
  };

  // Sign out from anywhere (the avatar button).
  window.bpmSignOut = async function () {
    try { await sb.auth.signOut(); } catch (e) { /* ignore */ }
    finally { window.location.replace('login.html'); }
  };

  // Current user's profile (role + name); used by Phase 4/5.
  window.bpmProfile = async function () {
    try {
      var u = await sb.auth.getUser();
      if (!u.data || !u.data.user) return null;
      var p = await sb.from('profiles').select('id,email,full_name,role').eq('id', u.data.user.id).single();
      return p.data || null;
    } catch (e) { return null; }
  };
})();
