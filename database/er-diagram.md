# ER Diagram — Shop Management System

```
┌──────────────────────────────────────────────────────┐
│                        USERS                         │
│──────────────────────────────────────────────────────│
│ PK  id            UUID                               │
│     name          VARCHAR(100)                       │
│     email         VARCHAR(150) UNIQUE                │
│     password      TEXT (bcrypt)                      │
│     role          ENUM(admin, member, viewer)         │
│     created_at    TIMESTAMPTZ                        │
└──────────────────────────────────────────────────────┘
         (manages through JWT roles — no FK)

┌──────────────────────────────────────────────────────┐
│                      PRODUCTS                        │
│──────────────────────────────────────────────────────│
│ PK  id             UUID                              │
│     name           VARCHAR(200)                      │
│     sku            VARCHAR(100) UNIQUE               │
│     category       VARCHAR(100)                      │
│     quantity       INTEGER >= 0                      │
│     purchase_price NUMERIC(12,2)                     │
│     selling_price  NUMERIC(12,2)                     │
│     is_archived    BOOLEAN                           │
│     created_at     TIMESTAMPTZ                       │
│     updated_at     TIMESTAMPTZ (auto)                │
└───────────────────────┬──────────────────────────────┘
                        │ 1:N
                        ▼
┌──────────────────────────────────────────────────────┐
│                       SALES                          │
│──────────────────────────────────────────────────────│
│ PK  id           UUID                                │
│ FK  product_id   → products.id                       │
│     quantity     INTEGER > 0                         │
│     unit_price   NUMERIC(12,2)                       │
│     total_price  NUMERIC(14,2) GENERATED             │
│     profit       NUMERIC(14,2)                       │
│     sale_date    TIMESTAMPTZ                         │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                  SAVINGS_MEMBERS                     │
│──────────────────────────────────────────────────────│
│ PK  id        UUID                                   │
│     name      VARCHAR(100)                           │
│     is_active BOOLEAN                                │
└───────────────────────┬──────────────────────────────┘
                        │ 1:N
                        ▼
┌──────────────────────────────────────────────────────┐
│               SAVINGS_CONTRIBUTIONS                  │
│──────────────────────────────────────────────────────│
│ PK  id        UUID                                   │
│ FK  member_id → savings_members.id                   │
│     amount    NUMERIC(12,2) >= 0                     │
│     date      DATE                                   │
│     is_missed BOOLEAN                                │
└──────────────────────────────────────────────────────┘
```

## Relationships

| From                  | Relationship | To                    |
|-----------------------|--------------|-----------------------|
| products              | 1 → N        | sales                 |
| savings_members       | 1 → N        | savings_contributions |

## Business Rules (enforced in application layer)

- `profit` per sale = `(selling_price − purchase_price) × quantity`
- `total_price` per sale = `unit_price × quantity` (DB generated column)
- Before inserting a sale, check `products.quantity >= sale.quantity`
- After inserting a sale, decrement `products.quantity -= sale.quantity`
- Savings: 7 fixed active members, equal daily contribution expected
