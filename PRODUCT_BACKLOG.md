# Maktabi - Product Backlog

## Vision
A stunning, interactive library management web app that makes librarians say "wow" - combining beautiful design with powerful functionality.

---

## Epic 1: Design System & Core UI (Sprint 1)
| ID | User Story | Story Points | Priority |
|----|------------|--------------|----------|
| US-1.1 | As a user, I want a cohesive design system with dark/light mode so the app feels premium | 5 | High |
| US-1.2 | As a user, I want a responsive sidebar navigation with smooth animations | 3 | High |
| US-1.3 | As a user, I want a stunning dashboard with key metrics at a glance | 5 | High |
| US-1.4 | As a user, I want micro-interactions (hover, click, transitions) everywhere | 3 | High |
| US-1.5 | As a user, I want a command palette (Cmd+K) for power-user navigation | 3 | Medium |

---

## Epic 2: Book Management (Sprint 2)
| ID | User Story | Story Points | Priority |
|----|------------|--------------|----------|
| US-2.1 | As a librarian, I want to add/edit/delete books with cover images | 5 | High |
| US-2.2 | As a librarian, I want to search books instantly with fuzzy search | 3 | High |
| US-2.3 | As a librarian, I want to filter by category, author, status, availability | 3 | High |
| US-2.4 | As a librarian, I want bulk actions (import CSV, export, delete multiple) | 5 | Medium |
| US-2.5 | As a librarian, I want book details modal with loan history | 3 | High |
| US-2.6 | As a librarian, I want drag-and-drop cover upload with preview | 3 | Medium |

---

## Epic 3: Member Management (Sprint 3)
| ID | User Story | Story Points | Priority |
|----|------------|--------------|----------|
| US-3.1 | As a librarian, I want to register members with photo, contact info, membership type | 5 | High |
| US-3.2 | As a librarian, I want to view member profile with loan history & fines | 3 | High |
| US-3.3 | As a librarian, I want to search/filter members by status, type, overdue | 3 | High |
| US-3.4 | As a librarian, I want member cards with QR codes for quick checkout | 3 | Medium |
| US-3.5 | As a librarian, I want membership expiration alerts & renewal workflow | 3 | Medium |

---

## Epic 4: Loans & Returns (Sprint 4)
| ID | User Story | Story Points | Priority |
|----|------------|--------------|----------|
| US-4.1 | As a librarian, I want a stunning checkout flow (scan book → scan member → confirm) | 5 | High |
| US-4.2 | As a librarian, I want quick return with condition check & fine calculation | 5 | High |
| US-4.3 | As a librarian, I want overdue tracking with automated notifications | 5 | High |
| US-4.4 | As a librarian, I want reservation/hold system with queue management | 5 | Medium |
| US-4.5 | As a librarian, I want loan history with filters & export | 3 | High |

---

## Epic 5: Statistics & Analytics (Sprint 5)
| ID | User Story | Story Points | Priority |
|----|------------|--------------|----------|
| US-5.1 | As a manager, I want real-time dashboard: total books, active loans, overdue, revenue | 5 | High |
| US-5.2 | As a manager, I want interactive charts: loans over time, popular books, categories | 5 | High |
| US-5.3 | As a manager, I want member analytics: most active, churn risk, demographics | 5 | Medium |
| US-5.4 | As a manager, I want exportable reports (PDF, Excel) with date ranges | 3 | Medium |
| US-5.5 | As a manager, I want predictive insights: "books to restock", "members to re-engage" | 5 | Low |

---

## Epic 6: Polish & Delight (Sprint 6)
| ID | User Story | Story Points | Priority |
|----|------------|--------------|----------|
| US-6.1 | As a user, I want page transitions & skeleton loaders | 3 | Medium |
| US-6.2 | As a user, I want keyboard shortcuts & accessibility (WCAG AA) | 5 | Medium |
| US-6.3 | As a user, I want PWA support (offline, install prompt) | 5 | Low |
| US-6.4 | As a user, I want onboarding tour & tooltips | 3 | Low |
| US-6.5 | As a user, I want delightful empty states & error illustrations | 3 | Low |

---

## Sprint Schedule (2-week sprints)

| Sprint | Dates | Focus | Deliverable |
|--------|-------|-------|-------------|
| 1 | Week 1-2 | Design System + Dashboard | Working navigation, theme, dashboard shell |
| 2 | Week 3-4 | Book Management | Full CRUD, search, filters, bulk ops |
| 3 | Week 5-6 | Member Management | Full CRUD, profiles, QR codes |
| 4 | Week 7-8 | Loans & Returns | Checkout, return, overdue, reservations |
| 5 | Week 9-10 | Statistics | Charts, analytics, reports, exports |
| 6 | Week 11-12 | Polish | Animations, PWA, accessibility, onboarding |

---

## Definition of Done
- [ ] Code reviewed
- [ ] TypeScript strict mode passes
- [ ] ESLint + Prettier clean
- [ ] Unit tests > 80% coverage
- [ ] E2E tests for critical paths
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark/light mode works
- [ ] Accessibility tested (axe-core)
- [ ] Performance budget met (LCP < 2.5s)
- [ ] Deployed to staging

---

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + CSS Variables for theming
- **Animations**: Framer Motion + Tailwind Animate
- **Charts**: Recharts (React-native, tree-shakeable)
- **State**: Zustand (lightweight, TypeScript-first)
- **Forms**: React Hook Form + Zod validation
- **Database**: SQLite (local) → PostgreSQL (prod) via Prisma ORM
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Date**: date-fns