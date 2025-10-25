// pages/api/add.js
// Adds a new shortlink record into data/links.json (file-based).
// WARNING: File-based DB is simple but not suitable for heavy concurrent writes.
// For production, use a real DB (Mongo, Postgres, KV, etc.)

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const body = req.body;
  const { id, url } = body || {};

  if (!id || !url) {
    return res.status(400).json({ error: "Missing id or url" });
  }

  const filePath = path.join(process.cwd(), "data", "links.json");
  let db = {};
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      db = JSON.parse(raw || "{}");
    } else {
      // ensure folder exists
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    }

    // Simple collision check: if id exists and points to different URL, generate conflict
    if (db[id] && db[id] !== url) {
      return res.status(409).json({ error: "ID conflict" });
    }

    db[id] = url;
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    return res.status(200).json({ success: true, short: `/r/${id}` });
  } catch (e) {
    console.error("add error", e);
    return res.status(500).json({ error: "Server error" });
  }
}
