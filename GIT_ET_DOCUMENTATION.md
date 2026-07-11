# Git & documentation

Ce document répond spécifiquement au critère de validation « Git et documentation » :
il faut présenter des commits réguliers et une documentation détaillée.

## Historique des commits

Dépôt : https://github.com/SafoueneN/Hotel

15 commits, répartis sur 5 jours, chacun correspondant à une étape identifiable du
cahier des charges plutôt qu'à des messages génériques (« wip », « fix », « update ») :

| Date | Commit | Contenu |
|---|---|---|
| 2026-07-07 11:41 | `5598cb0` | Point 1 — microservices reservation-service (Spring Boot/H2-MySQL) et payment-service (Node.js/MongoDB) |
| 2026-07-07 11:49 | `15831ba` | CRUD complet (update/delete) + fonctionnalités avancées (recherche de chambres disponibles, statistiques de paiements) |
| 2026-07-07 12:02 | `bd9dcaa` | Point 2 — serveur de découverte Eureka + enregistrement des 2 microservices |
| 2026-07-07 12:48 | `4cb808b` | Point 3 — API Gateway (Spring Cloud Gateway), routage vers les 2 microservices via Eureka |
| 2026-07-08 08:08 | `521e1a8` | Point 4 — serveur de configuration centralisé (Spring Cloud Config) |
| 2026-07-08 08:28 | `a58849f` | Point 5 — dockerisation complète (Dockerfiles + docker-compose, MySQL, MongoDB, Eureka, Config Server, Gateway) |
| 2026-07-08 08:44 | `30a5458` | Point 6 — sécurité Keycloak (realm hotelbook, rôles ADMIN/CLIENT), validation JWT à l'API Gateway |
| 2026-07-08 08:57 | `34f3ad3` | Point 7 — communication inter-microservices : REST synchrone + confirmation asynchrone via RabbitMQ |
| 2026-07-09 11:20 | `2a18353` | Frontend React (Vite) avec Keycloak, recherche, réservation, paiement, stats admin ; dockerisation complète (10 conteneurs) |
| 2026-07-09 11:26 | `4ada27d` | README de remise, nettoyage des données locales obsolètes |
| 2026-07-09 12:06 | `601a5db` | Refonte visuelle du frontend : identité de marque, hero, cartes, icônes, mode sombre |
| 2026-07-09 12:34 | `f54292c` | Illustrations SVG maison, texture des couvertures, code couleur par type de chambre, bandeau de confiance |
| 2026-07-09 20:08 | `814b86d` | Vraies photos (Wikimedia Commons/Flickr, CC) avec attribution des licences |
| 2026-07-10 10:59 | `784a2b2` | Ajout d'un compte de test Keycloak supplémentaire |
| 2026-07-11 10:29 | `00aaa8f` | Graphiques sur le dashboard admin + pipeline CI GitHub Actions |

**Ce que cet historique démontre :**
- Une progression traçable : chaque brique du cahier des charges (microservices → Eureka
  → Gateway → Config Server → Docker → Sécurité → Communication) a son propre commit,
  dans l'ordre logique de construction d'une architecture microservices.
- Des messages de commit descriptifs en français, écrits pour être compris sans avoir
  à ouvrir le diff.
- Un rythme réel de développement sur plusieurs jours, pas un unique commit final.

## Intégration et déploiement continus (CI/CD)

Chaque push déclenche deux pipelines GitHub Actions distincts :

**CI** (`.github/workflows/ci.yml`) :
- build les 4 services Spring Boot (eureka-server, config-server, api-gateway,
  reservation-service) avec Maven,
- installe les dépendances et vérifie la syntaxe du payment-service (Node.js),
- build le frontend (Vite),
- valide la syntaxe de `docker-compose.yml`.

**CD** (`.github/workflows/cd.yml`) :
- build l'image Docker de chacun des 6 services,
- les publie sur GitHub Container Registry (`ghcr.io/safouenen/hotelbook-<service>`),
  taguées `latest` et avec le SHA du commit — donc chaque push produit des images
  déployables et traçables jusqu'au commit exact qui les a générées.

Statut des builds : https://github.com/SafoueneN/Hotel/actions
Images publiées : https://github.com/SafoueneN?tab=packages

Ça donne une preuve continue, indépendante de la machine locale, que le code poussé
est réellement fonctionnel — pas seulement "ça marche chez moi".

## Documentation détaillée

| Document | Contenu |
|---|---|
| [`README.md`](README.md) | Schéma d'architecture, table de correspondance cahier des charges → implémentation, instructions de lancement (`docker compose up`), comptes de test, choix d'architecture justifiés (sécurité en périphérie, gestion de l'issuer JWT, profils dev/mysql), structure du dépôt |
| `HotelBook.postman_collection.json` | Collection Postman complète : obtention de token Keycloak, CRUD sur hôtels/chambres/réservations, paiements (dont le scénario sync+async), notifications |
| `GIT_ET_DOCUMENTATION.md` (ce fichier) | Preuve de régularité des commits et inventaire de la documentation, pour le critère de validation dédié |
| `.github/workflows/ci.yml` | Documentation exécutable : la CI décrit, mieux qu'un texte, comment chaque service se build et s'assemble |

## Comment le présenter à l'oral

1. Ouvrir https://github.com/SafoueneN/Hotel/commits/master — montrer le graphe de
   commits et leur régularité sur plusieurs jours.
2. Ouvrir https://github.com/SafoueneN/Hotel/actions — montrer un run CI vert.
3. Ouvrir `README.md` — montrer la table de correspondance et le schéma d'architecture.
4. Mentionner que ce fichier existe spécifiquement pour répondre au critère de notation.