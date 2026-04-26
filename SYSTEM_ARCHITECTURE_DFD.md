# System Architecture & Data Flow Overview

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Landing   │  │    Home     │  │    Shop     │  │    Cart & Auth      │ │
│  │    Page     │  │    Page     │  │    Page     │  │       Pages         │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                    │                                        │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐  │
│  │             SHARED COMPONENTS   │                                     │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────┴─────┐ ┌─────────────┐ ┌──────────┐  │  │
│  │  │Toolbar  │ │Product  │ │  Product  │ │   Toast     │ │ Loading  │  │  │
│  │  │Component│ │ Modal   │ │   Card    │ │ Messages    │ │ Spinners │  │  │
│  │  └─────────┘ └─────────┘ └───────────┘ └─────────────┘ └──────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                             SERVICE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Auth Service  │  │ Product Service │  │      Cart Service           │  │
│  │                 │  │                 │  │                             │  │
│  │ • Registration  │  │ • Load Products │  │ • Add/Remove Items          │  │
│  │ • Login/Logout  │  │ • Categories    │  │ • Update Quantities         │  │
│  │ • Session Mgmt  │  │ • Search/Filter │  │ • Calculate Totals          │  │
│  │ • Profile Mgmt  │  │ • Product Details│  │ • Session/DB Persistence    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│              │                   │                          │              │
│  ┌───────────┼───────────────────┼──────────────────────────┼───────────┐  │
│  │           │    Storage Service │                          │           │  │
│  │           │                   │                          │           │  │
│  │           │  • Image URL Gen  │                          │           │  │
│  │           │  • File Upload    │                          │           │  │
│  │           │  • Asset Mgmt     │                          │           │  │
│  │           └───────────────────┘                          │           │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                    ┌─────────────────────────────┐ │
│  │   LOCAL STORAGE     │                    │      SUPABASE CLOUD         │ │
│  │                     │                    │                             │ │
│  │ ┌─────────────────┐ │  ◄── Sync ───►     │ ┌─────────────────────────┐ │ │
│  │ │ Session Cart    │ │                    │ │    PostgreSQL DB        │ │ │
│  │ │ • Anonymous     │ │                    │ │                         │ │ │
│  │ │ • Temporary     │ │                    │ │ ┌─────────────────────┐ │ │ │
│  │ │ • JSON Format   │ │                    │ │ │     users           │ │ │ │
│  │ └─────────────────┘ │                    │ │ │     profiles        │ │ │ │
│  │                     │                    │ │ │     products        │ │ │ │
│  │ ┌─────────────────┐ │                    │ │ │     categories      │ │ │ │
│  │ │ User Preferences│ │                    │ │ │     cart_items      │ │ │ │
│  │ │ • Settings      │ │                    │ │ └─────────────────────┘ │ │ │
│  │ │ • Cache         │ │                    │ └─────────────────────────┘ │ │
│  │ └─────────────────┘ │                    │                             │ │
│  └─────────────────────┘                    │ ┌─────────────────────────┐ │ │
│                                             │ │     Auth Service        │ │ │
│                                             │ │ • JWT Tokens            │ │ │
│                                             │ │ • User Sessions         │ │ │
│                                             │ │ • Password Reset        │ │ │
│                                             │ └─────────────────────────┘ │ │
│                                             │                             │ │
│                                             │ ┌─────────────────────────┐ │ │
│                                             │ │    Storage Bucket       │ │ │
│                                             │ │ • Product Images        │ │ │
│                                             │ │ • Landing Images        │ │ │
│                                             │ │ • User Avatars          │ │ │
│                                             │ └─────────────────────────┘ │ │
│                                             └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow States & Transitions

### Authentication State Flow
```
┌─────────────┐    Register/Login     ┌─────────────────┐
│             │ ──────────────────────►│                 │
│ ANONYMOUS   │                       │  AUTHENTICATED  │
│             │ ◄────────────────────── │                 │
└─────────────┘         Logout        └─────────────────┘
      │                                         │
      │ Session Cart                           │ Database Cart
      ▼                                         ▼
┌─────────────┐                       ┌─────────────────┐
│ LOCAL       │    Login + Merge      │ SUPABASE        │
│ STORAGE     │ ──────────────────────►│ DATABASE        │
│             │                       │                 │
└─────────────┘                       └─────────────────┘
```

### Cart Persistence Flow
```
User Action ──► Cart Service ──► Decision Engine

                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
            [Authenticated?]                    [Anonymous?]
                    │                                   │
                    ▼                                   ▼
        ┌─────────────────────┐              ┌──────────────────┐
        │   Database Cart     │              │  Session Cart    │
        │                     │              │                  │
        │ • Persistent        │              │ • Temporary      │
        │ • Cross-device      │              │ • Single session │
        │ • Backup/Sync       │              │ • Browser only   │
        └─────────────────────┘              └──────────────────┘
```

## Component Communication Pattern

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        EVENT-DRIVEN ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Component A                Component B                Component C      │
│  ┌─────────┐                 ┌─────────┐                ┌─────────┐     │
│  │         │──── Event ─────►│         │──── Data ─────►│         │     │
│  │ Toolbar │                 │Cart Svc │                │ Badge   │     │
│  │         │◄─── Response────│         │◄─── Update────│         │     │
│  └─────────┘                 └─────────┘                └─────────┘     │
│                                   │                                     │
│                                   │ State Change                        │
│                                   ▼                                     │
│                          ┌─────────────────┐                           │
│                          │ BehaviorSubject │                           │
│                          │   Observable    │                           │
│                          └─────────────────┘                           │
│                                   │                                     │
│                          ┌────────┴────────┐                           │
│                          │                 │                           │
│                          ▼                 ▼                           │
│                  ┌─────────────┐   ┌─────────────┐                     │
│                  │ Component D │   │ Component E │                     │
│                  │   (Cart)    │   │  (Summary)  │                     │
│                  └─────────────┘   └─────────────┘                     │
└─────────────────────────────────────────────────────────────────────────┘
```

## Security & Data Protection Flow

```
┌─────────────┐         Encrypted         ┌─────────────────┐
│             │ ───────────────────────────►│                 │
│   CLIENT    │        HTTPS/TLS           │   SUPABASE      │
│             │ ◄───────────────────────────│                 │
└─────────────┘                           └─────────────────┘
      │                                             │
      │ JWT Token                                   │ RLS Policies
      │ Local Storage                               │ Row Level Security
      ▼                                             ▼
┌─────────────┐                           ┌─────────────────┐
│ AUTH STATE  │         Validation        │  DATABASE       │
│ • Token     │ ───────────────────────────►│  • User Data    │
│ • Session   │                           │  • Cart Items   │
│ • Refresh   │                           │  • Products     │
└─────────────┘                           └─────────────────┘
```

## Performance & Caching Strategy

```
User Request ──► Cache Check ──► Cache Hit? ──Yes──► Return Cached Data
                     │                │
                     │                No
                     ▼                │
            ┌─────────────────┐       │
            │                 │       ▼
            │ CACHE LAYERS    │  Network Request ──► Supabase
            │                 │       │
            │ 1. Memory       │       ▼
            │ 2. Local Storage│  Fresh Data ──► Update Cache ──► Return Data
            │ 3. Service Cache│
            │                 │
            └─────────────────┘

Cache Strategy by Data Type:
• Products: Long-term (1 hour)
• Categories: Long-term (2 hours)
• User Profile: Medium-term (30 min)
• Cart Data: Real-time (no cache)
• Images: Persistent (browser cache)
```

This comprehensive DFD documentation shows how data flows through your Baby Clothing Shop application, from user interactions through services to data persistence, including caching strategies and security considerations.