# Maintenance Manual - Suganya Metals App

This document provides instructions for maintaining the Suganya Metals application.

## 1. Data Backup (Weekly)

**Why:** To prevent data loss in case of computer failure.
**When:** Every Friday evening or Saturday.

### Instructions:

1.  Go to the project folder: `e:\suganya metals\apps\server\prisma`.
2.  Copy the file named `dev.db`.
3.  Paste it into a secure location (e.g., Google Drive, or a separate "Backups" folder).
4.  Rename it with the date, e.g., `dev_backup_2026_01_07.db`.

## 2. Server Restart

**Why:** If the app feels slow or "stuck".

### Instructions:

1.  Open the terminal (Command Prompt) running the app.
2.  Press `Ctrl + C` to stop the server.
3.  Type `npm run dev` and press Enter.
4.  Wait for the message: `Server running on port 3000`.

## 3. Adding New Features (Developer Note)

If you hire a developer in the future, show them this checklist:

- **Database**: SQLite (Prisma ORM). Schema is in `apps/server/prisma/schema.prisma`.
- **Frontend**: React (Vite).
- **Secrets**: Passwords and keys are in `.env`. **NEVER SHARE THIS FILE**.

## 4. Troubleshooting

**Issue: "Network Error" or "Login Failed"**

- Check if the server terminal is open and running.
- Check if your internet is connected (if using cloud database).

**Issue: "Missing Environment Variables"**

- Someone deleted `.env`. Restore it from `.env.example`.
