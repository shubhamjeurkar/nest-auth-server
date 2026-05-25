# Secure Authentication Server

A production-grade authentication server built with NestJS, PostgreSQL, and Redis. This isn't a tutorial reimplementation — it's a deliberate exploration of the trade-offs real auth systems face: how to rotate refresh tokens without race conditions, when RBAC stops being enough and ABAC starts earning its complexity, and why a Redis blocklist beats long-lived JWTs in practice.

Every architectural choice in this repo is documented with the reasoning behind it — including the alternatives considered and why they were rejected.

## Why This Project

Most auth tutorials stop at "signup, login, JWT." Production auth starts where they end: token rotation, revocation, role hierarchies, social login edge cases, rate limiting, and audit trails. This project implements the patterns that matter in real systems, with each one isolated and explained.

## Features

- **JWT authentication** with short-lived access tokens (15 min) and rotating refresh tokens (7 days)
- **Refresh token rotation** with reuse detection — stolen tokens invalidate the entire session family
- **RBAC + ABAC** — role-based access for coarse permissions, attribute-based for resource ownership
- **OAuth2 social login** (Google, GitHub) with account linking
- **Redis-backed token blocklist** for immediate revocation on logout or compromise
- **Rate limiting** on auth endpoints to deter credential stuffing
- **Audit logging** for all authentication events
- **Passport strategies** for Local, JWT, and OAuth flows
- **Custom Guards and Decorators** following NestJS idioms

## Tech Stack

- **Framework:** NestJS 10 (TypeScript)
- **Database:** PostgreSQL with Sequelize ORM
- **Cache/Sessions:** Redis
- **Auth:** Passport.js, bcrypt, jsonwebtoken
- **Validation:** class-validator, class-transformer

## Architecture Decisions

Detailed write-ups for each major decision live in [`/docs/decisions`](./docs/decisions):

- [Why refresh token rotation over sliding sessions](./docs/decisions/01-refresh-token-rotation.md)
- [Redis blocklist vs. short TTL: the revocation trade-off](./docs/decisions/02-token-revocation.md)
- [Layering ABAC on top of RBAC without overengineering](./docs/decisions/03-rbac-abac.md)
- [Account linking strategy for OAuth providers](./docs/decisions/04-oauth-account-linking.md)

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- PostgreSQL 14+
- Redis 6+
- npm 9+

### Setup

```bash
# Clone the repo
git clone https://github.com//nest-auth-server.git
cd nest-auth-server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your database and Redis credentials

# Run in development mode
npm run start:dev
```

The server starts on `http://localhost:3000`.

## Project Status

🚧 **In active development.** Currently implementing core JWT authentication and module structure. See commit history for progress.

## License

MIT