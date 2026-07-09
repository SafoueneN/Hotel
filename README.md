# HotelBook

Mini-projet de plateforme de réservation d'hôtel, réalisé en architecture microservices.

## Architecture

```
                        ┌─────────────┐
                        │   Frontend   │  React (Vite), servi par Nginx
                        │  (port 3100) │
                        └──────┬──────┘
                               │ REST (JWT Bearer)
                               ▼
                        ┌─────────────┐        ┌───────────┐
                        │ API Gateway  │◄──────►│ Keycloak  │  Auth (realm "hotelbook")
                        │ (port 8090)  │  JWT   │(port 8180)│
                        └──────┬──────┘        └───────────┘
                               │ découverte via Eureka
                  ┌────────────┼────────────┐
                  ▼                          ▼
        ┌───────────────────┐      ┌───────────────────┐
        │ reservation-service │      │  payment-service   │
        │ Spring Boot + MySQL │◄────►│  Node.js + MongoDB │
        │    (port 8081)      │ sync │    (port 8082)     │
        └──────────┬──────────┘  &   └──────────┬──────────┘
                    │            async (RabbitMQ)│
                    │                            │
        ┌───────────┴────────────┐   ┌───────────┴───────────┐
        │  eureka-server (8761)   │   │  config-server (8888)  │
        │  serveur de découverte  │   │  configuration centrale │
        └─────────────────────────┘   └─────────────────────────┘
```

## Correspondance avec le cahier des charges

| Point | Réalisé par |
|---|---|
| Frontend | `frontend/` — React (Vite), Keycloak login, recherche de disponibilité, réservation, paiement, stats admin |
| Microservice Spring Boot + MySQL/H2 | `reservation-service/` — H2 en dev, MySQL en Docker (profil `mysql`) |
| Microservice technologie différente + MongoDB | `payment-service/` — Node.js/Express + MongoDB |
| Serveur de découverte Eureka | `eureka-server/` — les 3 services Spring + la Gateway s'y enregistrent |
| API Gateway | `api-gateway/` — Spring Cloud Gateway, routage via découverte Eureka (`lb://`) |
| Serveur de configuration | `config-server/` — Spring Cloud Config (backend natif), consommé par les 3 services Spring + `payment-service` (Node) |
| Dockerisation | `docker-compose.yml` — 10 conteneurs orchestrés avec healthchecks |
| Sécurité Keycloak | Realm `hotelbook`, JWT validé au niveau de l'API Gateway (voir *Choix d'architecture* ci-dessous) |
| Communication sync/async | `payment-service` appelle `reservation-service` en **synchrone** (REST) pour récupérer le montant, puis confirme la réservation en **asynchrone** via **RabbitMQ** |

## Lancer le projet

Prérequis : Docker Desktop.

```bash
docker compose up -d --build
```

Attendre que tous les conteneurs soient `healthy` :

```bash
docker compose ps
```

### Accès

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3100 |
| API Gateway | http://localhost:8090 |
| Eureka Dashboard | http://localhost:8761 |
| Config Server | http://localhost:8888 |
| Keycloak Admin Console | http://localhost:8180 (admin/admin) |
| RabbitMQ Management | http://localhost:15672 (guest/guest) |

### Comptes de test (Keycloak, realm `hotelbook`)

| Utilisateur | Mot de passe | Rôle |
|---|---|---|
| `admin1` | `admin123` | ADMIN |
| `ali` | `ali123` | CLIENT |

### Postman

Une collection est fournie : `HotelBook.postman_collection.json` (inclut la récupération de token Keycloak).

## Choix d'architecture

- **Sécurité en périphérie** : seule l'API Gateway valide les tokens JWT (Keycloak). Les microservices en aval (`reservation-service`, `payment-service`) ne font pas de vérification JWT eux-mêmes — ils font confiance à la Gateway comme unique point d'entrée externe. Les appels service-à-service (ex. `payment-service` → `reservation-service`) passent directement en interne, sans jeton.
- **Règles d'autorisation** : lecture (`GET`) publique, écriture (`POST/PUT/PATCH`) authentifiée, suppression (`DELETE`) réservée au rôle `ADMIN`.
- **Émetteur JWT** : Keycloak est configuré avec un hostname fixe (`http://localhost:8180`) afin que le claim `iss` du token reste identique quel que soit le point d'accès. La Gateway récupère les clés publiques via le réseau Docker interne (`jwk-set-uri`) mais valide l'émetteur externe — nécessaire car navigateur et conteneurs n'accèdent pas à Keycloak par le même chemin réseau.
- **Développement local sans Docker** : chaque service Spring a un profil `dev` autonome (H2 en mémoire) ; le frontend peut tourner via `npm run dev` (Vite, port 5173) directement contre les mêmes services.

## Structure du dépôt

```
reservation-service/   Spring Boot + JPA (MySQL/H2) — hôtels, chambres, réservations
payment-service/       Node.js + Express + MongoDB — paiements, notifications
eureka-server/         Serveur de découverte
config-server/         Configuration centralisée (backend natif, fichiers dans src/main/resources/config)
api-gateway/            Spring Cloud Gateway + sécurité OAuth2/JWT
frontend/               React (Vite) + Keycloak
keycloak/               Export du realm importé automatiquement au démarrage
docker-compose.yml      Orchestration complète
```
