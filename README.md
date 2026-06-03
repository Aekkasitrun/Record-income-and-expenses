# Finance Tracker — บันทึกรายรับ-รายจ่าย

แอปพลิเคชันบันทึกรายรับ-รายจ่ายส่วนตัว สำหรับใช้งานคนเดียว ไม่มีระบบ login

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS v4 + MUI v7 |
| Backend | NestJS 11 + TypeScript |
| ORM | Prisma v5 |
| Database | PostgreSQL 16 |
| Infra | Docker + docker-compose |

**Ports**: Frontend `3000` · Backend API `4000` · PostgreSQL `5432` · Swagger UI `/api/docs`

---

## การ Run ครั้งแรก (First-time Setup)

### สิ่งที่ต้องติดตั้งก่อน
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### ขั้นตอน

**1. Clone project**
```bash
git clone https://github.com/Aekkasitrun/Record-income-and-expenses.git
cd Record-income-and-expenses
```

**2. สร้างไฟล์ `.env`**
```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env` ตั้งค่า password ที่ต้องการ:
```env
POSTGRES_PASSWORD=your_strong_password_here
```

> ⚠️ อย่า commit ไฟล์ `.env` ขึ้น git (ถูก ignore ไว้แล้ว)

**3. Build และ Start containers**
```bash
docker compose -f docker-compose.dev.yml build --no-cache && docker compose -f docker-compose.dev.yml up -d
```

รอจนกว่า containers ทั้งหมดจะ start (ประมาณ 1-3 นาทีครั้งแรก)

**4. รัน Database Migration (ทำแค่ครั้งแรกครั้งเดียว)**
```bash
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev --name init
```

**5. Seed ข้อมูลเริ่มต้น — หมวดหมู่ 12 รายการ (ทำแค่ครั้งแรกครั้งเดียว)**
```bash
docker compose -f docker-compose.dev.yml exec backend npm run prisma:seed
```

**6. เปิดเว็บ**

| URL | คำอธิบาย |
|---|---|
| http://localhost:3000 | แอปหลัก (Frontend) |
| http://localhost:4000/api/docs | Swagger API docs |

---

## การ Run ครั้งถัดไป (Subsequent Runs)

ครั้งถัดไปไม่ต้อง migrate หรือ seed แล้ว แค่:

```bash
docker compose -f docker-compose.dev.yml up -d
```

หยุด containers:
```bash
docker compose -f docker-compose.dev.yml down
```

---

## คำสั่งที่ใช้บ่อย

### ดู Logs
```bash
# ดู log ทุก service
docker compose -f docker-compose.dev.yml logs -f

# ดู log เฉพาะ backend
docker compose -f docker-compose.dev.yml logs -f backend

# ดู log เฉพาะ frontend
docker compose -f docker-compose.dev.yml logs -f frontend
```

### Database
```bash
# เปิด Prisma Studio (UI สำหรับดูและแก้ไข database)
docker compose -f docker-compose.dev.yml exec backend npm run prisma:studio
# → เปิด http://localhost:5555

# สร้าง migration ใหม่ (หลังแก้ schema.prisma)
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev --name <ชื่อที่บอกว่าแก้อะไร>

# Seed ข้อมูลเริ่มต้นใหม่
docker compose -f docker-compose.dev.yml exec backend npm run prisma:seed
```

### Restart เฉพาะ service
```bash
docker compose -f docker-compose.dev.yml restart backend
docker compose -f docker-compose.dev.yml restart frontend
```

### Build ใหม่ทั้งหมด (เมื่อเปลี่ยน dependencies)
```bash
docker compose -f docker-compose.dev.yml up -d --build --no-cache
```

---

## โครงสร้าง Project

```
Record-income-and-expenses/
├── CLAUDE.md                  ← AI multi-agent workflow guide
├── docker-compose.yml         ← Production
├── docker-compose.dev.yml     ← Development (hot reload)
├── .env.example               ← Template สำหรับสร้าง .env
│
├── frontend/                  ← React SPA
│   ├── src/
│   │   ├── components/        ← UI components (layout, forms, ui widgets)
│   │   ├── pages/             ← Dashboard, Transactions, Categories, Reports
│   │   ├── stores/            ← Zustand state management
│   │   ├── services/          ← axios API calls
│   │   ├── types/             ← TypeScript types
│   │   └── schemas/           ← Zod validation schemas
│   └── Dockerfile
│
└── backend/                   ← NestJS API
    ├── src/
    │   ├── modules/
    │   │   ├── transactions/  ← CRUD รายรับ-รายจ่าย
    │   │   ├── categories/    ← CRUD หมวดหมู่
    │   │   └── reports/       ← รายงานรายเดือน/รายปี
    │   └── prisma/            ← Database service
    ├── prisma/
    │   ├── schema.prisma      ← Database schema
    │   └── seed.ts            ← ข้อมูลหมวดหมู่เริ่มต้น
    └── Dockerfile
```

---

## API Reference

### Transactions (รายรับ-รายจ่าย)
| Method | Path | คำอธิบาย |
|---|---|---|
| GET | `/api/transactions` | ดูรายการ (filter ได้ด้วย `?type=INCOME&page=1&limit=20`) |
| GET | `/api/transactions/summary` | ยอดรวมรายรับ รายจ่าย และคงเหลือ |
| POST | `/api/transactions` | เพิ่มรายการ |
| PATCH | `/api/transactions/:id` | แก้ไขรายการ |
| DELETE | `/api/transactions/:id` | ลบรายการ |

### Categories (หมวดหมู่)
| Method | Path | คำอธิบาย |
|---|---|---|
| GET | `/api/categories` | ดูหมวดหมู่ทั้งหมด |
| POST | `/api/categories` | เพิ่มหมวดหมู่ |
| PATCH | `/api/categories/:id` | แก้ไขหมวดหมู่ |
| DELETE | `/api/categories/:id` | ลบหมวดหมู่ (ไม่ได้ถ้ามีรายการใช้อยู่) |

### Reports (รายงาน)
| Method | Path | คำอธิบาย |
|---|---|---|
| GET | `/api/reports/monthly` | รายงานรายเดือน `?year=2026&month=6` |
| GET | `/api/reports/yearly` | รายงานรายปี `?year=2026` |
| GET | `/api/reports/by-category` | รายงานแยกตามหมวดหมู่ |

ดู interactive docs ได้ที่: **http://localhost:4000/api/docs**

---

## Troubleshooting

### Docker build ล้มเหลว — TLS handshake timeout
Docker ต่อ Docker Hub ไม่ได้ ให้ตรวจสอบ:
- ปิด VPN แล้วลองใหม่
- Docker Desktop → Settings → Docker Engine → เพิ่ม registry mirror:
```json
{
  "registry-mirrors": ["https://mirror.gcr.io"]
}
```

### `npm ci` หรือ `npm install` ล้มเหลวใน Docker
เปลี่ยน Dockerfile ให้ใช้ `npm install --legacy-peer-deps` แทน `npm ci`

### Backend ต่อ Database ไม่ได้
```bash
# ตรวจสอบว่า postgres container ทำงานอยู่
docker compose -f docker-compose.dev.yml ps

# ดู log ของ postgres
docker compose -f docker-compose.dev.yml logs postgres
```

### Port ถูกใช้งานอยู่แล้ว (Port already in use)
หยุด process ที่ใช้ port นั้นอยู่ หรือแก้ port ใน `docker-compose.dev.yml`

### ต้องการ reset database ทั้งหมด
```bash
# หยุดและลบ volumes ทั้งหมด (ข้อมูลจะหายหมด)
docker compose -f docker-compose.dev.yml down -v

# Start ใหม่และ setup ใหม่ตั้งแต่ต้น
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev --name init
docker compose -f docker-compose.dev.yml exec backend npm run prisma:seed
```

---

## Production Deploy

```bash
# 1. แก้ .env ให้ใช้ production values
# 2. Build และ start
docker compose up -d --build

# 3. รัน migration (production ใช้ deploy ไม่ใช่ dev)
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run prisma:seed
```

---

## Git Commit Convention

```
feat(scope): เพิ่ม feature ใหม่
fix(scope): แก้ bug
db(prisma): แก้ schema หรือ migration
style(frontend): แก้ UI/styling
docs: แก้ documentation
```

Scopes: `frontend` · `backend` · `docker` · `prisma` · `docs`
