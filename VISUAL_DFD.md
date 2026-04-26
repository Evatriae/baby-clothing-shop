# Visual Data Flow Diagram - Baby Clothing Shop App

## Context Diagram (Level 0)

```mermaid
graph TB
    subgraph External["External Entities"]
        C[👤 Customer]
        DB[🗄️ Supabase Database]
        ST[📁 Supabase Storage]
        AU[🔐 Supabase Auth]
    end
    
    subgraph System["Baby Clothing Shop System"]
        APP[📱 Mobile App]
    end
    
    C -->|User Actions| APP
    APP -->|Responses| C
    
    APP -->|Data Queries| DB
    DB -->|Data Results| APP
    
    APP -->|Image Requests| ST
    ST -->|Image URLs| APP
    
    APP -->|Auth Requests| AU
    AU -->|Auth Tokens| APP
```

## Level 1 DFD - Main Processes

```mermaid
graph TD
    subgraph External["External Entities"]
        U[👤 Customer]
        DB[(🗄️ Database)]
    end
    
    subgraph Processes["Main Processes"]
        P1[🔐 1. User Authentication]
        P2[📦 2. Product Management]
        P3[🛒 3. Shopping Cart]
        P4[💾 4. Data Storage]
    end
    
    subgraph DataStores["Data Stores"]
        D1[(D1: User Profiles)]
        D2[(D2: Products)]
        D3[(D3: Categories)]
        D4[(D4: Cart Items)]
        D5[(D5: Local Storage)]
    end
    
    %% Customer interactions
    U -->|Registration/Login| P1
    P1 -->|Auth Status| U
    
    U -->|Browse Products| P2
    P2 -->|Product Data| U
    
    U -->|Cart Actions| P3
    P3 -->|Cart Status| U
    
    %% Process to Data Store connections
    P1 <-->|User Data| D1
    P2 <-->|Product Info| D2
    P2 <-->|Category Info| D3
    P3 <-->|Cart Items| D4
    P3 <-->|Session Cart| D5
    
    %% Database synchronization
    P4 <-->|Sync Data| DB
    D1 <-.->|Backup| P4
    D2 <-.->|Backup| P4
    D3 <-.->|Backup| P4
    D4 <-.->|Backup| P4
```

## Level 2 DFD - Authentication Process

```mermaid
graph TD
    subgraph User["👤 Customer"]
        UC[User Input]
    end
    
    subgraph AuthProcess["🔐 Authentication Process"]
        P11[1.1 Validate Input]
        P12[1.2 Register User]
        P13[1.3 Login User]
        P14[1.4 Manage Session]
    end
    
    subgraph DataStores["Data Stores"]
        D1[(D1: User Profiles)]
        D6[(D6: Auth Sessions)]
    end
    
    subgraph External["External Services"]
        SA[🔐 Supabase Auth]
    end
    
    UC -->|Registration Data| P11
    UC -->|Login Credentials| P11
    
    P11 -->|Valid Data| P12
    P11 -->|Valid Credentials| P13
    
    P12 -->|Create Account| SA
    P13 -->|Authenticate| SA
    
    SA -->|Auth Response| P14
    SA -->|User Session| P14
    
    P12 <-->|Profile Data| D1
    P14 <-->|Session Data| D6
    
    P14 -->|Auth Status| UC
```

## Level 2 DFD - Shopping Cart Process

```mermaid
graph TD
    subgraph User["👤 Customer"]
        UC[User Actions]
    end
    
    subgraph CartProcess["🛒 Shopping Cart Process"]
        P31[3.1 Add Item]
        P32[3.2 Update Quantity]
        P33[3.3 Remove Item]
        P34[3.4 Calculate Total]
        P35[3.5 Persist Cart]
    end
    
    subgraph DataStores["Data Stores"]
        D4[(D4: Cart Items)]
        D5[(D5: Local Storage)]
        D2[(D2: Products)]
    end
    
    subgraph Decisions["Decision Points"]
        AUTH{Authenticated?}
        EXIST{Item Exists?}
    end
    
    UC -->|Add to Cart| P31
    UC -->|Update Item| P32
    UC -->|Remove Item| P33
    
    P31 --> AUTH
    AUTH -->|Yes| D4
    AUTH -->|No| D5
    
    P31 --> EXIST
    EXIST -->|Yes| P32
    EXIST -->|No| P35
    
    P32 <-->|Update Quantity| D4
    P32 <-->|Update Local| D5
    
    P33 <-->|Delete Item| D4
    P33 <-->|Remove Local| D5
    
    P34 <-->|Product Prices| D2
    P34 <-->|Cart Items| D4
    P34 <-->|Local Items| D5
    
    P35 <-->|Store Cart| D4
    P35 <-->|Store Local| D5
    
    P34 -->|Cart Summary| UC
```

## Data Flow Timing Diagram

```mermaid
sequenceDiagram
    participant C as 👤 Customer
    participant A as 📱 App
    participant AU as 🔐 Auth Service
    participant DB as 🗄️ Database
    participant LS as 💾 Local Storage

    Note over C,LS: User Registration & Login Flow
    C->>A: Register (email, password, name)
    A->>AU: Create Account
    AU-->>A: User ID & Token
    A->>DB: Create Profile
    DB-->>A: Profile Saved
    A-->>C: Registration Success
    
    Note over C,LS: Product Browsing Flow
    C->>A: Browse Products
    A->>DB: Query Categories
    DB-->>A: Category List
    A->>DB: Query Products by Category
    DB-->>A: Product List
    A-->>C: Display Products
    
    Note over C,LS: Shopping Cart Flow (Authenticated)
    C->>A: Add to Cart (product, qty, options)
    A->>DB: Check Existing Cart Item
    DB-->>A: Existing Item Data
    A->>DB: Insert/Update Cart Item
    DB-->>A: Operation Success
    A-->>C: Cart Updated
    
    Note over C,LS: Shopping Cart Flow (Anonymous)
    C->>A: Add to Cart (product, qty, options)
    A->>LS: Store Cart Item
    LS-->>A: Storage Success
    A-->>C: Cart Updated (Session Only)
    
    Note over C,LS: Cart Synchronization on Login
    C->>A: Login
    A->>AU: Authenticate
    AU-->>A: Auth Success
    A->>LS: Get Session Cart
    LS-->>A: Session Cart Items
    A->>DB: Merge with User Cart
    DB-->>A: Merge Complete
    A->>LS: Clear Session Cart
    A-->>C: Login Success + Merged Cart
```

## Component Interaction Matrix

| Component | User Auth | Product Mgmt | Shopping Cart | Database | Local Storage |
|-----------|-----------|--------------|---------------|----------|---------------|
| **User Auth** | - | Provides user context | User ID for cart | User profiles | Session tokens |
| **Product Mgmt** | User preferences | - | Product details | Product data | Cached products |
| **Shopping Cart** | User-specific carts | Product validation | - | Cart persistence | Anonymous carts |
| **Database** | Profile storage | Product catalog | Persistent carts | - | Sync/backup |
| **Local Storage** | Session cache | Product cache | Session cart | Offline buffer | - |

## Error Flow Diagram

```mermaid
graph TD
    subgraph ErrorTypes["Error Categories"]
        E1[🔌 Network Errors]
        E2[🔐 Auth Errors]
        E3[🗄️ Database Errors]
        E4[📝 Validation Errors]
    end
    
    subgraph ErrorHandling["Error Handling"]
        H1[Retry Logic]
        H2[Fallback Data]
        H3[User Notification]
        H4[Offline Mode]
    end
    
    subgraph Recovery["Recovery Actions"]
        R1[Cache Data]
        R2[Queue Operations]
        R3[Sync When Online]
        R4[Manual Retry]
    end
    
    E1 --> H1
    E1 --> H4
    E2 --> H3
    E3 --> H2
    E4 --> H3
    
    H1 --> R4
    H2 --> R1
    H4 --> R2
    H4 --> R3
```

This comprehensive DFD documentation provides multiple views of the data flows in your Baby Clothing Shop app, from high-level context down to detailed process flows and error handling patterns.