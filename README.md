# Rift

<h3 align="center">
One Permanent Link. One Purpose. Unlimited Updates.
</h3>

<p align="center">
A modern platform for creating permanent task-specific links that never need to change.
</p>

---

# What is Rift?

Rift is a **Central Link Infrastructure Platform**.

Instead of sharing destination URLs directly, Rift gives every important task its own permanent public link.

Every Rift link acts as a stable entry point while the destination behind it can be updated at any time.

Imagine you have a portfolio.

Normally you might share:

```

https://myportfolio-v1.com

```

Six months later you redesign it.

Now you have to share:

```

https://myportfolio-v2.com

```

Everyone with the old link now has an outdated URL.

Rift solves this problem.

Instead of sharing your portfolio directly, you create a permanent Rift link.

```

rift.dpdns.org/portfolio/A7XK29M4PQ8L

```

Initially it points to

```

https://myportfolio-v1.com

```

Later you update it to

```

https://myportfolio-v2.com

```

Then

```

https://mywebsite.com

```

The public Rift link **never changes**.

Everyone who already has your Rift link automatically reaches the latest destination.

---

# The Problem

URLs change.

Websites are redesigned.

Products launch.

Campaigns expire.

Documentation moves.

Resumes get updated.

Portfolios evolve.

Every time this happens, the original URL becomes outdated.

This causes

- Broken QR Codes
- Outdated resumes
- Invalid documentation links
- Marketing links that expire
- Business cards pointing to old websites
- Social media bios needing constant updates

---

# The Rift Solution

Every important task gets its own permanent Central Link.

Instead of sharing

```

Destination URL

```

you share

```

Rift Central Link

```

The destination can change forever.

The Rift link never does.

---

# Link Structure

Every Rift link follows the format

```

rift.dpdns.org/{slug}/{12-character-public-id}

```

Example

```

rift.dpdns.org/portfolio/A7XK29M4PQ8L

```

The URL contains two parts.

### Slug

A human-readable identifier describing the purpose.

Examples

```

portfolio
resume
startup
docs
presentation
project-alpha

```

### Public ID

A cryptographically generated 12-character identifier.

Example

```

A7XK29M4PQ8L

```

This guarantees uniqueness while allowing readable URLs.

---

# One Link Per Task

Rift is **not** a "one link for everything" platform.

Each task receives its own permanent Central Link.

Example

| Task | Permanent Link |
|------|----------------|
| Portfolio | `rift.dpdns.org/portfolio/A7XK29M4PQ8L` |
| Resume | `rift.dpdns.org/resume/J9MQLP82TW4A` |
| Startup | `rift.dpdns.org/startup/H8QLA71MPK2N` |
| Documentation | `rift.dpdns.org/docs/KL82QW91XPT7` |
| Event | `rift.dpdns.org/event/LM29PXA81QT6` |

Each Central Link is completely independent.

Updating one never affects another.

---

# Features

## Permanent Central Links

Create permanent public links that never need to change.

---

## Dynamic Destination Updates

Change the destination whenever you want without changing the shared URL.

---

## Human Readable URLs

Readable slugs make links memorable.

```

rift.dpdns.org/portfolio/A7XK29M4PQ8L

```

instead of

```

rift.dpdns.org/Xd92PQLM2K

```

---

## Secure Public IDs

Every link contains a random cryptographically generated identifier.

Benefits

- Prevents collisions
- Better security
- Stable public identifiers
- Fast lookups

---

## Link Management Dashboard

Manage every Central Link from one dashboard.

Supported operations

- Create
- Update
- Delete
- Activate
- Deactivate

---

## Authentication

Secure account system featuring

- User Registration
- Login
- Logout
- JWT Authentication
- HttpOnly Cookies
- Secure Cookies
- Session Management

---

## Redirect Engine

Fast redirect service built for production.

Optimized using

- Redis
- PostgreSQL
- Nginx
- Go

---

## Redis Cache

Frequently accessed links are cached.

Benefits

- Lower latency
- Faster redirects
- Reduced database load

---

## PostgreSQL Storage

Stores

- Users
- Central Links
- Destinations
- Metadata
- Sessions

---

## Reserved Slug Protection

Protected routes cannot be claimed.

Examples

```

login
signup
api
admin

```

---

## Validation

Built-in validation for

- URLs
- Slugs
- Authentication
- Usernames
- Passwords

---

## Security

Production-ready security including

- HTTPS
- Secure Cookies
- HttpOnly Cookies
- HSTS
- Rate Limiting
- Security Headers
- Reverse Proxy
- Request Size Limits
- Input Validation

---

## Health Monitoring

Health endpoint reports

- API Status
- PostgreSQL Status
- Redis Status
- Worker Status
- Uptime

---

# Architecture

```

                 Cloudflare
                      │
                      ▼
                  Nginx
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
     Go Backend              Redis Cache
          │
          ▼
      PostgreSQL

```

---

# Tech Stack

## Backend

- Go
- Gin
- SQLC

## Database

- PostgreSQL

## Cache

- Redis

## Reverse Proxy

- Nginx

## Deployment

- Docker
- Docker Compose
- Cloudflare

## Authentication

- JWT
- HttpOnly Cookies

---

# Use Cases

## Developers

Maintain one permanent portfolio link.

---

## Job Seekers

Never update resume links again.

---

## Freelancers

Keep client portfolios current.

---

## Startups

Use one permanent launch URL through every stage.

Landing Page

↓

Waitlist

↓

Beta

↓

Production

↓

Documentation

The public link never changes.

---

## Businesses

Keep QR codes and printed material permanently valid.

---

## Marketing Teams

Reuse campaign URLs across multiple launches.

---

## Event Organizers

Reuse event links every year.

---

## Content Creators

Maintain permanent links for sponsorship pages, communities and resources.

---

# Roadmap

## Analytics

- Total Clicks
- Daily Activity
- Device Statistics
- Browser Statistics
- Geographic Insights
- Referrers

---

## QR Codes

Generate permanent QR codes for every Central Link.

---

## Custom Domains

Use

```

go.example.com

```

instead of

```

rift.dpdns.org/...

```

---

## Link Branding

Customize

- Title
- Description
- Open Graph Preview
- Branding

---

## Team Workspaces

Shared Central Links with

- Roles
- Permissions
- Collaboration

---

## Public API

Programmatically create and manage Central Links.

---

## Mobile Applications

Native mobile experience for Android and iOS.

---

# Why Rift?

Links shouldn't expire simply because their destinations do.

Rift separates the **identity of a link** from the **location it points to**.

A Central Link becomes a permanent reference that can evolve alongside your work.

Share once.

Update forever.

---

# License

MIT License

---

# Built With

Built using Go, PostgreSQL, Redis, Docker and Cloudflare.

---

<p align="center">

**Rift**

### One Permanent Link. One Purpose. Unlimited Updates.

</p>