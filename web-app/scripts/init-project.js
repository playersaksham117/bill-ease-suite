#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const directories = [
  "app/(auth)",
  "app/workspace",
  "app/workspace/dashboard",
  "app/workspace/settings",
  "app/workspace/support",
  "app/workspace/pos",
  "app/workspace/crm",
  "app/workspace/exin",
  "app/workspace/tracinvent",
  "app/workspace/accounts",
  "components/ui",
  "lib",
  "types",
  "hooks",
  "public",
];

const baseDir = __dirname;

directories.forEach((dir) => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

console.log("✅ Project structure initialized successfully!");
