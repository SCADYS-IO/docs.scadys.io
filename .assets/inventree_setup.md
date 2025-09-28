# InvenTree Local Setup (Hyper-V + Ubuntu 24.04)

These steps bring up InvenTree in a Hyper-V VM running Ubuntu Server 24.04, with PostgreSQL pinned at v16. Includes a workaround for the `pg_dump` client/server mismatch.

---

## A. VM and OS Prep

1. **Create Hyper-V VM**
   - Generation 2, disable Secure Boot
   - 2 vCPUs, 4 GB RAM, 50 GB disk
   - Attach Ubuntu Server 24.04 ISO
   - Connect to an External switch

2. **Install Ubuntu**
   - Accept defaults
   - Tick **OpenSSH Server**

3. **Update and install prerequisites**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y docker.io docker-compose-v2 git ca-certificates curl
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   newgrp docker
   docker run --rm hello-world
   ```

---

## B. InvenTree Docker Setup

1. **Fetch container files**
   ```bash
   mkdir -p ~/inventree && cd ~/inventree
   curl -LO https://raw.githubusercontent.com/inventree/InvenTree/master/contrib/container/docker-compose.yml
   curl -LO https://raw.githubusercontent.com/inventree/InvenTree/master/contrib/container/Caddyfile
   curl -LO https://raw.githubusercontent.com/inventree/InvenTree/master/contrib/container/.env
   ```

2. **Pin PostgreSQL to v16**
   Edit `docker-compose.yml`:
   ```yaml
   image: postgres:16
   ```

3. **Configure environment**
   ```bash
   nano .env
   ```
   Change:
   ```
   INVENTREE_DB_USER=scadys_pg
   INVENTREE_DB_PASSWORD=<strong_password_here>
   INVENTREE_EXT_VOLUME=./inventree-data
   INVENTREE_SITE_URL="http://<VM_IP_ADDRESS>"
   ```

4. **Neutralize plugin installs (for now)**
   ```bash
   mkdir -p inventree-data
   sudo touch inventree-data/plugins.txt
   sudo truncate -s 0 inventree-data/plugins.txt
   ```

---

## C. Initialize and Run

1. **Start DB and wait for readiness**
   ```bash
   docker compose up -d inventree-db
   docker compose logs -f inventree-db
   # wait for: "database system is ready to accept connections"
   # then Ctrl+C
   ```

2. **Run migrations (skip built-in backup)**
   ```bash
   docker compose run --rm inventree-server invoke update --skip-backup
   ```

3. **Create superuser**
   ```bash
   docker compose run --rm inventree-server invoke superuser
   ```
   - Username: e.g. `admin`
   - Email: optional
   - Password: your choice

4. **Bring up the full stack**
   ```bash
   docker compose up -d
   docker compose ps
   ```

5. **Login**
   - Browser → `http://<VM_IP_ADDRESS>`
   - Use the superuser account you just created

---

## Backup Strategy (important)

- The built-in `invoke update` tries to run `pg_dump` (v15) which mismatches PG16.
- Always run migrations with `--skip-backup`.
- Use the **Postgres 16 client** for real backups:

```bash
mkdir -p ~/inventree/backups
docker compose exec -T inventree-db   pg_dump -U scadys_pg -d inventree -Fc   > ~/inventree/backups/inventree_$(date +%F_%H%M).dump
```

That produces compressed `.dump` files you can restore later with `pg_restore`.

---

## Next Steps

- Configure settings (currency, units, date format).
- Add at least one supplier and category.
- Import a small CSV of parts to test.
- Take a Hyper-V snapshot (“Fresh-Installed-PG16”) as a restore point.
