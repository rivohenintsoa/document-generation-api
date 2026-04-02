# Document Generation API

API backend scalable permettant la génération de documents PDF en masse (jusqu'à 1000+ documents par batch) avec gestion de la concurrence, résilience et observabilité.

---

## Objectif

Ce projet répond à un besoin de génération de documents à grande échelle avec :

- Traitement asynchrone
- Haute performance
- Tolérance aux erreurs
- Monitoring complet

---

## Architecture

```
Client → API (Express)
          ↓
        Queue (Bull + Redis)
          ↓
        Workers (concurrency)
          ↓
     PDF Generation Service
          ↓
       MongoDB (Documents + Batches)
```

### Composants

- **API (Express + TypeScript)** — Gestion des endpoints REST et orchestration
- **Queue (Bull + Redis)** — Gestion des jobs asynchrones et parallélisation
- **Worker** — Traitement des documents en parallèle (concurrency configurable)
- **MongoDB** — Stockage des batches et documents

---

## Choix techniques

**Pourquoi Bull + Redis ?**
- Gestion native des retries
- Concurrency configurable
- Robustesse en production

**Pourquoi MongoDB ?**
- Flexible pour stocker documents et batches
- Compatible GridFS (évolution future)

**Pourquoi Worker séparé ?**
- Scalabilité horizontale
- Isolation des traitements lourds

**Pourquoi Prometheus metrics ?**
- Monitoring temps réel
- Analyse de performance (throughput, erreurs)

---

## API Endpoints

### Créer un batch

```
POST /api/documents/batch
```

Body :

```json
{
  "userIds": [1, 2, 3, ...]
}
```

Response :

```json
{
  "batchId": "uuid",
  "status": "pending",
  "total": 1000
}
```

### Statut d'un batch

```
GET /api/documents/batch/:batchId
```

### Récupérer un document

```
GET /api/documents/:documentId
```

### Documents (OpenApi)

```
GET /api/docs
```

### Health check

```
GET /health
```

### Metrics (Prometheus)

```
GET /metrics
```

---

## Observabilité

Métriques exposées :

- `documents_generated_total`
- `jobs_completed`
- `jobs_failed`
- `batch_processing_duration_seconds`
- `queue_size`

---

## Performance

### Benchmark

```bash
npm run benchmark
```

### Résultat exemple

```
Processed 1000 docs in 12.4s (80 docs/sec)
```

### Détails

- Concurrency : 10 workers
- Temps moyen par document : ~1s
- Traitement parallèle optimisé
- Aucun échec (jobs_failed = 0)

---

## Résilience

- Retry automatique (3 tentatives)
- Timeout (5 secondes par job)
- Gestion des erreurs centralisée
- Health check (Mongo, Redis, Queue)
- Graceful shutdown (SIGTERM)

---

## Installation avec Docker (recommandé)

### 1. Cloner le projet

```bash
git clone git@github.com:rivohenintsoa/document-generation-api.git
cd document-generation-api
```

### 2. Lancer l'application

```bash
docker compose up --build
```

### 3. Accès

| Service | URL |
|---------|-----|
| API | http://localhost:3000 |
| Metrics | http://localhost:3000/metrics |
| Health | http://localhost:3000/health |
| Documents | http://localhost:3000/api/docs |

---

## Variables d'environnement

```env
PORT=3000

MONGO_URI=mongodb://mongo:27017/document-db
REDIS_HOST=redis
REDIS_PORT=6379

API_BASE_URL=http://api:3000
```

---

## Test rapide

```bash
curl -X POST http://localhost:3000/api/documents/batch \
  -H "Content-Type: application/json" \
  -d '{"userIds":[1,2,3]}'
```