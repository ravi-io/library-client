# 🔐 Authentication — End-to-End Walkthrough

## Architecture Overview

Your auth system is a **split-responsibility architecture** between:

| Layer        | Tech                               | Responsibility                                           |
| ------------ | ---------------------------------- | -------------------------------------------------------- |
| **Frontend** | Next.js 15 + Better Auth React SDK | Forms, validation, cookie-based sessions                 |
| **Backend**  | Express 5 + Better Auth Core       | Auth API endpoints, session management, password hashing |
| **Database** | PostgreSQL + Prisma                | User, Session, Account, Verification storage             |

---

## 🏗️ High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "🖥️ Frontend — Next.js (port 3000)"
        A["LoginForm / SignUpForm"]
        B["Zod Schema Validation"]
        C["authClient (Better Auth React SDK)"]
        D["Next.js Middleware"]
    end

    subgraph "⚙️ Backend — Express (port 5000)"
        E["Rate Limiter (authLimiter)"]
        F["Better Auth Handler<br/>(app.all /api/auth/*splat)"]
        G["requireAuth Middleware"]
        H["requireRoles Middleware"]
        I["Your Custom Routes<br/>(GET /me, POST /register-staff)"]
    end

    subgraph "🗄️ Database — PostgreSQL"
        J["User table"]
        K["Session table"]
        L["Account table"]
        M["Verification table"]
    end

    A -->|"1. User fills form"| B
    B -->|"2. Validated data"| C
    C -->|"3. POST /api/auth/sign-up/email<br/>or /api/auth/sign-in/email"| E
    E -->|"4. Rate check passes"| F
    F -->|"5. Hash password, create records"| J
    F -->|"5. Create session"| K
    F -->|"5. Create account link"| L
    F -->|"6. Set-Cookie: session_token"| C
    C -->|"7. Cookie stored in browser"| A
    D -->|"8. Check cookie on /login /signup"| A
    G -->|"9. Read cookie, call auth.api.getSession"| F
    G -->|"10. Attach user to req"| I
    H -->|"11. Check user.role"| I

    style A fill:#1e293b,stroke:#38bdf8,color:#fff
    style B fill:#1e293b,stroke:#a78bfa,color:#fff
    style C fill:#1e293b,stroke:#38bdf8,color:#fff
    style D fill:#1e293b,stroke:#f59e0b,color:#fff
    style E fill:#0f172a,stroke:#ef4444,color:#fff
    style F fill:#0f172a,stroke:#22c55e,color:#fff
    style G fill:#0f172a,stroke:#f59e0b,color:#fff
    style H fill:#0f172a,stroke:#f59e0b,color:#fff
    style I fill:#0f172a,stroke:#38bdf8,color:#fff
    style J fill:#312e81,stroke:#818cf8,color:#fff
    style K fill:#312e81,stroke:#818cf8,color:#fff
    style L fill:#312e81,stroke:#818cf8,color:#fff
    style M fill:#312e81,stroke:#818cf8,color:#fff
```

---

## 📝 Sign Up Flow — Step by Step

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 📱 SignUpForm
    participant Z as 🛡️ Zod Validation
    participant SDK as 🔗 authClient SDK
    participant RL as 🚦 Rate Limiter
    participant BA as ✅ Better Auth
    participant DB as 🗄️ PostgreSQL
    participant MW as 🔒 Next.js Middleware

    U->>F: Fills name, email, password, confirmPassword
    F->>Z: Validate with signUpSchema
    Note over Z: ✅ Email format check<br/>✅ Password ≥ 6 chars<br/>✅ Passwords match<br/>✅ No XSS/SQL injection
    Z-->>F: Validation passes
    F->>SDK: authClient.signUp.email({ email, password, name })
    SDK->>RL: POST http://localhost:5000/api/auth/sign-up/email
    Note over RL: Check: ≤ 30 requests<br/>per 15 min per IP
    RL->>BA: Request forwarded
    Note over BA: 🔐 Better Auth internally:<br/>1. Hash password (bcrypt/scrypt)<br/>2. Create User row (role=student)<br/>3. Create Account row (providerId=credential)<br/>4. Create Session row + token<br/>5. Set Set-Cookie header
    BA->>DB: INSERT into user, account, session
    DB-->>BA: Records created
    BA-->>SDK: 200 OK + Set-Cookie: better-auth.session_token=xxx
    SDK-->>F: { data: { user, session }, error: null }
    F->>U: toast.success + router.push("/")
    Note over MW: Future visit to /login or /signup:<br/>Cookie exists → redirect to /
```

### What YOU wrote (your code):

1. **[SignUpForm.tsx](file:///home/rvkrm/Desktop/code/projects/college-projects/library-client/src/modules/auth/components/SignUpForm.tsx)** — React form with `react-hook-form` + `zodResolver`
2. **[schemas/index.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-client/src/modules/auth/schemas/index.ts)** — Zod schemas with XSS/SQL injection guards (`isSafeInput`)
3. **[auth-client.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-client/src/lib/auth-client.ts)** — 8-line file that creates the SDK client pointing at `localhost:5000`
4. **Error handling** — catch `authError` from SDK, show toast, manage loading state

### What BETTER AUTH does (you didn't write this):

1. **Password hashing** — Uses scrypt/bcrypt internally, you never see the raw password
2. **User record creation** — Inserts into `user` table with `role: "student"` default
3. **Account linking** — Creates an `account` row with `providerId: "credential"`
4. **Session generation** — Creates a cryptographically-random session token
5. **Cookie management** — Sets `Set-Cookie: better-auth.session_token` with httpOnly, secure flags
6. **Duplicate email detection** — Returns error if email already exists

---

## 🔑 Login Flow — Step by Step

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 📱 LoginForm
    participant Z as 🛡️ Zod Validation
    participant SDK as 🔗 authClient SDK
    participant RL as 🚦 Rate Limiter
    participant BA as ✅ Better Auth
    participant DB as 🗄️ PostgreSQL

    U->>F: Enters email + password
    F->>Z: Validate with loginSchema
    Note over Z: ✅ Valid email format<br/>✅ Password ≥ 6 chars<br/>✅ No XSS patterns
    Z-->>F: Passes
    F->>SDK: authClient.signIn.email({ email, password })
    SDK->>RL: POST http://localhost:5000/api/auth/sign-in/email
    RL->>BA: Rate check OK → forward
    Note over BA: 🔐 Better Auth internally:<br/>1. Look up user by email<br/>2. Look up account (providerId=credential)<br/>3. Verify password hash<br/>4. Create new Session row<br/>5. Set session cookie
    BA->>DB: SELECT user + account, INSERT session
    DB-->>BA: Done
    BA-->>SDK: 200 OK + Set-Cookie
    SDK-->>F: { data: { user, session }, error: null }
    F->>U: toast.success + redirect to /
```

### What YOU wrote:

1. **[LoginForm.tsx](file:///home/rvkrm/Desktop/code/projects/college-projects/library-client/src/modules/auth/components/LoginForm.tsx)** — Form with email + password fields, error/loading state
2. **Zod validation on client** — Prevents garbage from even reaching the server

### What BETTER AUTH does:

1. **User lookup** — Finds user by email in DB
2. **Password verification** — Compares submitted password against stored hash
3. **Session creation** — New `session` row with `token`, `expiresAt`, `ipAddress`, `userAgent`
4. **Cookie setting** — `better-auth.session_token` sent back to browser

---

## 🔑 Forgot / Reset Password Flow

```mermaid
sequenceDiagram
    participant B as 🌐 Browser
    participant SDK as 🔗 authClient
    participant EX as ⚙️ Express Backend
    participant BA as ✅ Better Auth
    participant Mail as 📧 Email Transporter
    participant DB as 🗄️ PostgreSQL

    B->>SDK: authClient.forgetPassword({ email, redirectTo: "/reset-password" })
    SDK->>EX: POST /api/auth/forget-password
    EX->>BA: Handles request
    Note over BA: Generates verification token<br/>Saves token to verification table
    BA->>DB: INSERT into verification
    BA->>Mail: sendResetPassword({ user, url })
    Note over Mail: Sends email containing link:<br/>/reset-password?token=xxxx
    Mail-->>B: User receives email and clicks link
    B->>SDK: Open /reset-password?token=xxxx
    B->>SDK: Enters new password
    SDK->>EX: POST /api/auth/reset-password (token + password)
    EX->>BA: Validate token & update
    BA->>DB: SELECT token, UPDATE account.password
    BA-->>SDK: 200 OK (Password updated)
```

### What YOU wrote:
1. **[email.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/utils/email.ts)** — Nodemailer utility to send formatted HTML emails using your SMTP config.
2. **[auth.ts configuration](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/config/auth.ts#L12-L29)** — The `sendResetPassword` callback to connect Better Auth with your nodemailer utility.

### What BETTER AUTH does:
1. **Endpoint exposure** — Exposes `/api/auth/forget-password` and `/api/auth/reset-password`.
2. **Token generation** — Creates a cryptographically safe reset token with an expiry period.
3. **Database lifecycle** — Automatically manages saving and checking the token against the `verification` table.
4. **Automatic url binding** — Assembles the URL containing the token automatically for the email template.

---

## 🛡️ Protected Route Access — Session Validation

```mermaid
sequenceDiagram
    participant B as 🌐 Browser
    participant EX as ⚙️ Express Server
    participant RA as 🔒 requireAuth
    participant BA as ✅ Better Auth
    participant DB as 🗄️ PostgreSQL
    participant C as 📦 Controller

    B->>EX: GET /api/auth/me (Cookie: session_token=xxx)
    EX->>RA: requireAuth middleware runs
    RA->>BA: auth.api.getSession({ headers: req.headers })
    Note over BA: 🔐 Better Auth internally:<br/>1. Extract token from Cookie header<br/>2. Look up session in DB<br/>3. Check expiresAt > now<br/>4. Join with user table<br/>5. Return { user, session } or null
    BA->>DB: SELECT session + user WHERE token=xxx
    DB-->>BA: Session + User found
    BA-->>RA: { user: {..., role: "student"}, session: {...} }
    RA->>RA: Attach req.user and req.session
    RA->>C: next() → getMe controller
    C-->>B: 200 { user: {...}, session: {...} }
```

### What YOU wrote:

1. **[rbac.ts → requireAuth](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/middlewares/rbac.ts#L9-L43)** — Middleware that calls `auth.api.getSession()` and attaches `req.user` / `req.session`
2. **[auth.controller.ts → getMe](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/modules/auth/auth.controller.ts#L9-L14)** — Simply returns the attached user/session

### What BETTER AUTH does:

1. **Cookie parsing** — Extracts `better-auth.session_token` from the `Cookie` header
2. **Session lookup** — Queries DB for matching session token
3. **Expiry check** — Validates session hasn't expired
4. **User hydration** — Joins `user` table to return full user object (including `role`)

---

## 👮 Role-Based Access Control (RBAC)

```mermaid
sequenceDiagram
    participant B as 🌐 Browser (Admin)
    participant EX as ⚙️ Express
    participant RA as 🔒 requireAuth
    participant RR as 👮 requireRoles
    participant C as 📦 registerStaff
    participant BA as ✅ Better Auth
    participant DB as 🗄️ PostgreSQL

    B->>EX: POST /api/auth/register-staff (Cookie + body)
    EX->>RA: requireAuth validates session
    RA-->>RR: req.user.role = "library_admin" ✅
    RR->>RR: Check role in ["library_admin"]
    RR->>C: next() → registerStaff runs
    C->>BA: auth.api.signUpEmail({ body: { email, password, name } })
    Note over BA: Creates user with<br/>default role "student"
    BA->>DB: INSERT user (role=student)
    C->>DB: prisma.user.update({ role: "librarian" })
    Note over C: Direct DB role escalation<br/>(bypasses Better Auth default)
    C-->>B: 201 { user: { role: "librarian" } }
```

### Your 3 Roles:

| Role            | Access Level            | How Assigned                                    |
| --------------- | ----------------------- | ----------------------------------------------- |
| `student`       | Default for all signups | Auto-assigned by Better Auth config             |
| `librarian`     | Staff-level access      | Admin creates via `/register-staff` + DB update |
| `library_admin` | Full system access      | Admin creates via `/register-staff` + DB update |

### What YOU wrote:

1. **[requireRoles](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/middlewares/rbac.ts#L49-L72)** — Wraps `requireAuth` + role array check
2. **[registerStaff](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/modules/auth/auth.controller.ts#L20-L60)** — Creates user via BA, then escalates role via direct Prisma update
3. **[auth config → role field](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/config/auth.ts#L13-L22)** — `input: false` prevents users from setting their own role

### What BETTER AUTH does:

1. **User creation** — Standard signup with default role
2. **Additional fields support** — Allows `role` as a custom field on the User model

---

## 🍪 Session Cookie + Next.js Middleware

```mermaid
flowchart LR
    A["User visits /login"] --> B{"Cookie exists?<br/>better-auth.session_token"}
    B -->|Yes| C["Redirect to /"]
    B -->|No| D["Show LoginForm"]

    E["User visits /signup"] --> F{"Cookie exists?"}
    F -->|Yes| G["Redirect to /"]
    F -->|No| H["Show SignUpForm"]

    style B fill:#1e293b,stroke:#f59e0b,color:#fff
    style F fill:#1e293b,stroke:#f59e0b,color:#fff
    style C fill:#0f172a,stroke:#22c55e,color:#fff
    style G fill:#0f172a,stroke:#22c55e,color:#fff
    style D fill:#0f172a,stroke:#38bdf8,color:#fff
    style H fill:#0f172a,stroke:#38bdf8,color:#fff
```

### What YOU wrote — [middleware.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-client/src/middleware.ts):

- Runs at the **Edge** (before page renders)
- Checks for `better-auth.session_token` or `__secure-better-auth.session_token` cookie
- If cookie exists and user visits `/login` or `/signup` → **redirect to `/`**
- If no cookie → allow through (show auth page)

### What BETTER AUTH does:

- Sets the cookie name convention (`better-auth.session_token` / `__secure-better-auth.session_token`)
- You just read the cookie — BA manages its lifecycle

---

## 🗄️ Database Schema — What Better Auth Requires

```mermaid
erDiagram
    User {
        string id PK "cuid()"
        string email UK
        string name "nullable"
        boolean emailVerified "default: false"
        string image "nullable"
        string role "default: student"
        datetime createdAt
        datetime updatedAt
    }

    Session {
        string id PK "cuid()"
        string userId FK
        datetime expiresAt
        string token UK "session cookie value"
        string ipAddress "nullable"
        string userAgent "nullable"
        datetime createdAt
        datetime updatedAt
    }

    Account {
        string id PK "cuid()"
        string userId FK
        string accountId "user's id at provider"
        string providerId "credential"
        string accessToken "nullable"
        string refreshToken "nullable"
        string password "hashed password"
        datetime expiresAt "nullable"
        datetime createdAt
        datetime updatedAt
    }

    Verification {
        string id PK "cuid()"
        string identifier "email or other"
        string value "verification code"
        datetime expiresAt
    }

    User ||--o{ Session : "has many"
    User ||--o{ Account : "has many"
```

> [!IMPORTANT]
> The `Account` table stores the **hashed password** (not the User table). This is Better Auth's design — it separates identity (User) from credentials (Account). The `providerId` is `"credential"` for email/password auth. If you added Google/GitHub OAuth later, each would be a separate Account row.

---

## 🔒 Security Layers Summary

| Layer                          | What                                                    | Where                                                                                                                          | Who Wrote It   |
| ------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| **Client-side Zod validation** | XSS/SQL injection guards, email format, password length | [schemas/index.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-client/src/modules/auth/schemas/index.ts) | ✍️ You         |
| **Server-side Zod validation** | Same guards on `registerStaff` endpoint                 | [auth.schema.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/modules/auth/auth.schema.ts)     | ✍️ You         |
| **Auth rate limiting**         | 30 requests / 15 min per IP on `/api/auth/*`            | [rateLimit.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/middlewares/rateLimit.ts)          | ✍️ You         |
| **Global rate limiting**       | 100 requests / 15 min per IP on all routes              | [rateLimit.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/middlewares/rateLimit.ts)          | ✍️ You         |
| **Helmet**                     | HTTP security headers (CSP, XSS, etc.)                  | [app.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/app.ts#L50)                              | ✍️ You         |
| **CORS**                       | Only `CORS_ORIGIN` allowed with credentials             | [app.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/app.ts#L51-L54)                          | ✍️ You         |
| **Password hashing**           | scrypt/bcrypt on signup                                 | Internal to Better Auth                                                                                                        | 🤖 Better Auth |
| **Session tokens**             | Cryptographic random tokens, httpOnly cookies           | Internal to Better Auth                                                                                                        | 🤖 Better Auth |
| **Role protection**            | `input: false` on role field prevents self-escalation   | [auth.ts config](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/config/auth.ts#L19)              | ✍️ You         |
| **RBAC middleware**            | `requireAuth` + `requireRoles` on protected routes      | [rbac.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/middlewares/rbac.ts)                    | ✍️ You         |
| **Next.js edge middleware**    | Redirect authenticated users away from auth pages       | [middleware.ts](file:///home/rvkrm/Desktop/code/projects/college-projects/library-client/src/middleware.ts)                    | ✍️ You         |
| **Trusted origins**            | Only `localhost:3000` can call auth APIs                | [auth.ts config](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/config/auth.ts#L9)               | ✍️ You         |

---

## 📊 Responsibility Split — Your Code vs Better Auth

```mermaid
pie title "Auth Responsibility Split"
    "Your Code" : 55
    "Better Auth" : 45
```

### ✍️ What YOU own (~55%):

- Form UI and UX (React Hook Form + Shadcn components)
- Client & server-side input validation (Zod schemas with security refinements)
- Rate limiting strategy (express-rate-limit)
- RBAC middleware (requireAuth, requireRoles)
- Role escalation logic (registerStaff controller)
- Next.js edge middleware for route guarding
- Security headers (Helmet, CORS)
- Database schema definition (Prisma)
- Auth configuration (Better Auth options)

### 🤖 What BETTER AUTH owns (~45%):

- Password hashing and verification
- Session token generation and cookie management
- The entire `/api/auth/*` HTTP API surface (signup, signin, signout, session)
- Account linking model (credential, OAuth providers)
- Cookie naming conventions and security flags
- Session expiry and refresh logic
- The React SDK hooks (`authClient.signIn.email`, `authClient.signUp.email`)
- `auth.api.getSession()` for server-side session retrieval

> [!NOTE]
> The `app.all('/api/auth/*splat', toNodeHandler(auth))` line in [app.ts:59](file:///home/rvkrm/Desktop/code/projects/college-projects/library-server/src/app.ts#L59) is the **bridge** — it hands over ALL requests to `/api/auth/*` directly to Better Auth's internal router. Better Auth then handles signup, signin, signout, session retrieval, etc. without you writing any controller code for those endpoints.

> [!WARNING]
> The `toNodeHandler(auth)` line is placed **before** `express.json()` body parser (line 62). This is intentional — Better Auth reads the raw request stream itself. If body parsers ran first, the stream would be consumed and Better Auth would get an empty body.
