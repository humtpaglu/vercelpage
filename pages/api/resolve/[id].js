// pages/api/resolve/[id].js
// Simple file-based resolver. Reads data/links.json for id->url mapping.

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), "data", "links.json");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Database missing" });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const db = JSON.parse(raw || "{}");
    const url = db[id];
    if (!url) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ url });
  } catch (e) {
    console.error("resolve error", e);
    return res.status(500).json({ error: "Server error" });
  }
}
