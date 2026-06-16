-- ============================================================================
-- BPM Intelligence — 0004 client config
-- Client-level UI identity sourced from the DB (analyst card, avatar, display
-- name). Read by the front-end chrome (chrome.js) so nothing is hardcoded.
-- Idempotent: safe to re-run.
-- ============================================================================

alter table public.clients add column if not exists config jsonb;

update public.clients
  set config = $j${
    "displayName": "陳氏家族信託",
    "avatarInitial": "陳",
    "analyst": {
      "name": "陳政宏 Masa Chen",
      "title": { "zh": "資深分析師 · 大中華區", "en": "Senior analyst · Greater China" },
      "contact": { "zh": "+886 2 8729 5000 · 台北", "en": "+886 2 8729 5000 · TPE" }
    }
  }$j$::jsonb
  where slug = 'chen-family';
