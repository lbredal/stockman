---
description: Back up the Stockman Postgres database. Use before running destructive migrations, before a release, or on a regular schedule.
---

Back up the Stockman Postgres database.

## Local backup
```bash
pg_dump $DATABASE_URL -Fc -f backups/stockman_$(date +%Y%m%d_%H%M%S).dump
```
- `-Fc` — custom format (compressed, restoreable with `pg_restore`)
- Store in a `backups/` directory (add to `.gitignore`)

## Restore from backup
```bash
pg_restore -d $DATABASE_URL -c backups/<filename>.dump
```
`-c` drops existing objects before restoring. Use with caution on a live database.

## Production backup (Railway / Render / Supabase)
- **Railway**: use the Railway dashboard → database → "Create backup"
- **Render**: use the Render dashboard → PostgreSQL → "Manual backup"
- **Supabase**: use the Supabase dashboard → Settings → Backups → "Download"

## Automated backups
For production, enable automatic daily backups in your hosting provider's dashboard. Do not rely on manual backups alone.

## Before a destructive migration
1. Take a manual backup
2. Note the backup filename
3. Run the migration
4. If anything goes wrong, restore immediately:
   ```bash
   pg_restore -d $DATABASE_URL -c backups/<filename>.dump
   ```

## Notes
- Add `backups/` to `.gitignore` — never commit database dumps
- Keep at least 3 recent backups before deleting old ones
- Test your restore process before you need it in an emergency
