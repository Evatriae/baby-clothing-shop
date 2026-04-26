# Data Flow Diagram (DFD) - Baby Clothing Shop App

## System Overview
The Baby Clothing Shop is an Ionic/Angular mobile application with Supabase backend that allows users to browse and purchase baby clothing items.

## Context Diagram (Level 0 DFD)

```
                    ┌─────────────────┐
                    │                 │
        User Data   │     CUSTOMER    │    Product Orders
     ◄──────────────┤                 ├──────────────►
                    │                 │
                    └─────────────────┘
                             │
                             │ User Interactions
                             ▼
    ┌─────────────────────────────────────────────────────────┐
    │                                                         │
    │              Baby Clothing Shop System                  │
    │                                                         │
    └─────────────────────────────────────────────────────────┘
                             │
                             │ Database Operations
                             ▼
                    ┌─────────────────┐
                    │                 │
         Data       │  SUPABASE DB    │    Stored Data
     ◄──────────────┤                 ├──────────────►
                    │                 │
                    └─────────────────┘
```

## Level 1 DFD - Main System Processes

```
┌─────────────┐          Registration/Login Data          ┌─────────────────┐
│             │ ─────────────────────────────────────────► │                 │
│   CUSTOMER  │                                           │  1. USER AUTH   │
│             │ ◄───────────── Auth Status ────────────── │                 │
└─────────────┘                                           └─────────────────┘
       │                                                           │
       │                                                           │
       │ Product                                                   │ User Data
       │ Browsing         ┌─────────────────┐                     │
       └─────────────────►│                 │                     │
                          │ 2. PRODUCT      │                     │
         Product Data     │   MANAGEMENT    │                     │
       ◄─────────────────│                 │                     │
                          └─────────────────┘                     │
                                   │                              │
                                   │ Product Info                 │
                                   │                              │
                                   ▼                              ▼
              ┌─────────────────────────────────────────────────────────┐
              │                                                         │
              │                  SUPABASE DATABASE                      │
              │                                                         │
              │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
              │  │   Users     │  │  Products   │  │ Cart Items  │     │
              │  │             │  │             │  │             │     │
              │  └─────────────┘  └─────────────┘  └─────────────┘     │
              └─────────────────────────────────────────────────────────┘
                                   ▲                              ▲
                                   │                              │
                                   │ Cart Operations              │
                          ┌─────────────────┐                     │
         Cart Actions     │                 │                     │
       ─────────────────► │ 3. SHOPPING     │                     │
                          │    CART         │─────────────────────┘
         Cart Status      │                 │
       ◄─────────────────│                 │
                          └─────────────────┘
```

## Level 2 DFD - Detailed Process Breakdown

### Process 1: User Authentication

```
┌─────────────┐
│  CUSTOMER   │
└─────────────┘
       │
       │ Registration Data (email, password, name)
       ▼
┌─────────────────┐         User Credentials         ┌─────────────────┐
│                 │ ─────────────────────────────────► │                 │
│ 1.1 REGISTER    │                                   │  SUPABASE AUTH  │
│                 │ ◄───────── Auth Response ──────── │                 │
└─────────────────┘                                   └─────────────────┘
       │
       │ Profile Data
       ▼
┌─────────────────┐         Profile Info            ┌──────────────────┐
│                 │ ─────────────────────────────────► │                  │
│ 1.2 CREATE      │                                   │   USER PROFILES  │
│     PROFILE     │                                   │   (Database)     │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘

┌─────────────┐
│  CUSTOMER   │
└─────────────┘
       │
       │ Login Credentials (email, password)
       ▼
┌─────────────────┐         Login Data              ┌─────────────────┐
│                 │ ─────────────────────────────────► │                 │
│ 1.3 LOGIN       │                                   │  SUPABASE AUTH  │
│                 │ ◄─────── Session Token ──────── │                 │
└─────────────────┘                                   └─────────────────┘
       │
       │ Load User Profile
       ▼
┌─────────────────┐         Profile Query           ┌──────────────────┐
│                 │ ─────────────────────────────────► │                  │
│ 1.4 LOAD        │                                   │   USER PROFILES  │
│     PROFILE     │ ◄─────── Profile Data ────────── │   (Database)     │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘
```

### Process 2: Product Management

```
┌─────────────┐
│  CUSTOMER   │
└─────────────┘
       │
       │ Browse Request
       ▼
┌─────────────────┐         Category Query           ┌──────────────────┐
│                 │ ─────────────────────────────────► │                  │
│ 2.1 BROWSE      │                                   │   CATEGORIES     │
│     CATEGORIES  │ ◄─────── Category List ────────── │   (Database)     │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘
       │
       │ Product Request
       ▼
┌─────────────────┐         Product Query            ┌──────────────────┐
│                 │ ─────────────────────────────────► │                  │
│ 2.2 LOAD        │                                   │    PRODUCTS      │
│     PRODUCTS    │ ◄─────── Product Data ─────────── │   (Database)     │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘
       │
       │ Filtered Products
       ▼
┌─────────────────┐         Search Criteria         ┌──────────────────┐
│                 │                                   │                  │
│ 2.3 FILTER &    │                                   │  PRODUCT SEARCH  │
│     SEARCH      │ ◄─────── Search Results ───────── │     ENGINE       │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘
```

### Process 3: Shopping Cart

```
┌─────────────┐
│  CUSTOMER   │
└─────────────┘
       │
       │ Add to Cart (product_id, quantity, size, color)
       ▼
┌─────────────────┐    Check Existing Items       ┌──────────────────┐
│                 │ ─────────────────────────────────► │                  │
│ 3.1 ADD TO      │                                   │   CART_ITEMS     │
│     CART        │ ◄─────── Existing Items ────────── │   (Database)     │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘
       │
       │ Insert/Update Cart Item
       ▼
┌─────────────────┐    Cart Item Data             ┌──────────────────┐
│                 │ ─────────────────────────────────► │                  │
│ 3.2 UPDATE      │                                   │   CART_ITEMS     │
│     CART        │                                   │   (Database)     │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘

┌─────────────┐
│  CUSTOMER   │
└─────────────┘
       │
       │ View Cart Request
       ▼
┌─────────────────┐    Cart Query (user_id)        ┌──────────────────┐
│                 │ ─────────────────────────────────► │                  │
│ 3.3 LOAD        │                                   │   CART_ITEMS     │
│     CART        │ ◄─────── Cart Items ──────────── │   (Database)     │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘
       │
       │ Enrich with Product Data
       ▼
┌─────────────────┐    Product Details Query       ┌──────────────────┐
│                 │ ─────────────────────────────────► │                  │
│ 3.4 ENRICH      │                                   │    PRODUCTS      │
│     CART DATA   │ ◄─────── Product Info ────────── │   (Database)     │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘
       │
       │ Calculate Totals
       ▼
┌─────────────────┐                                ┌──────────────────┐
│                 │                                   │                  │
│ 3.5 CALCULATE   │                                   │  CART SUMMARY    │
│     TOTALS      │ ─────────► Cart Summary ────────► │     DATA         │
│                 │                                   │                  │
└─────────────────┘                                   └──────────────────┘
```

## Data Stores

### D1: USER PROFILES
```
Fields:
- id (UUID, Primary Key)
- email (String)
- first_name (String)
- last_name (String)
- avatar_url (String, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)

Access Patterns:
- Read: Profile loading, authentication
- Write: Registration, profile updates
```

### D2: PRODUCTS
```
Fields:
- id (UUID, Primary Key)
- name (String)
- description (Text)
- price (Decimal)
- category_id (UUID, Foreign Key)
- image (String, URL)
- sizes (Array of Strings)
- colors (Array of Strings)
- in_stock (Boolean)
- featured (Boolean)
- created_at (Timestamp)

Access Patterns:
- Read: Product browsing, search, cart enrichment
- Write: Product management (admin only)
```

### D3: CATEGORIES
```
Fields:
- id (UUID, Primary Key)
- name (String)
- description (Text)
- image (String, URL)
- created_at (Timestamp)

Access Patterns:
- Read: Category browsing, product filtering
- Write: Category management (admin only)
```

### D4: CART_ITEMS
```
Fields:
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → USER PROFILES)
- product_id (UUID, Foreign Key → PRODUCTS)
- quantity (Integer)
- selected_size (String, Optional)
- selected_color (String, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)

Access Patterns:
- Read: Cart loading, total calculations
- Write: Add to cart, update quantity, remove items
- Delete: Remove items, clear cart
```

## External Entities

### 1. CUSTOMER
```
Description: End users of the mobile application
Interactions:
- Sends: Registration data, login credentials, product searches, cart actions
- Receives: Product information, cart status, user profile data, authentication status
```

### 2. SUPABASE DATABASE
```
Description: PostgreSQL database hosted on Supabase
Interactions:
- Receives: SQL queries, data mutations, authentication requests
- Sends: Query results, stored data, authentication responses
```

### 3. SUPABASE STORAGE
```
Description: File storage service for images
Interactions:
- Receives: Image upload requests, file access requests
- Sends: Image URLs, file data
```

### 4. SUPABASE AUTH
```
Description: Authentication service
Interactions:
- Receives: Login/registration requests, session validation
- Sends: JWT tokens, user sessions, authentication status
```

## Data Flow Descriptions

### Primary Flows

1. **User Registration Flow**
   ```
   Customer → Registration Data → System → User Credentials → Supabase Auth
   Supabase Auth → Auth Response → System → Profile Data → User Profiles DB
   ```

2. **Product Browsing Flow**
   ```
   Customer → Browse Request → System → Category Query → Categories DB
   Categories DB → Category List → System → Product Query → Products DB
   Products DB → Product Data → System → Filtered Products → Customer
   ```

3. **Add to Cart Flow**
   ```
   Customer → Add to Cart → System → Check Existing → Cart Items DB
   Cart Items DB → Existing Items → System → Insert/Update → Cart Items DB
   System → Cart Summary → Customer
   ```

4. **Cart Persistence Flow (Authenticated Users)**
   ```
   System → Cart Item Data → Cart Items DB (persistent storage)
   Login Event → Load Cart Query → Cart Items DB → Cart Data → System
   ```

5. **Session Cart Flow (Anonymous Users)**
   ```
   System → Cart Data → Local Storage (browser)
   Page Load → Retrieve Cart → Local Storage → Cart Data → System
   ```

## Error Handling Flows

1. **Authentication Errors**
   ```
   Invalid Credentials → Supabase Auth → Error Response → System → Error Message → Customer
   ```

2. **Database Errors**
   ```
   Database Failure → Error Response → System → Fallback/Retry Logic → Error Notification → Customer
   ```

3. **Network Errors**
   ```
   Network Failure → System → Cache/Local Storage → Offline Data → Customer
   ```

This DFD shows the complete data flow architecture of the Baby Clothing Shop app, including user authentication, product management, shopping cart functionality, and data persistence patterns.