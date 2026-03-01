# Budgy - Full Budget Management App Feature Plan

## Context

Budgy is currently a lightweight React 19 + Vite + Tailwind CSS PWA that serves as a salary budget calculator using the 50/30/20 rule. It supports solo and dual-income modes with customizable ratios and visual breakdowns. The goal is to transform it into a full-featured budget management app for 1-2 person households, with expense tracking, recurring payments, and settlement tracking between partners. This document is a **complete product feature specification** intended to be handed to a developer (or AI agent) to plan the technical architecture and build the app.

### What Exists Today
- **Stack**: React 19, Vite 7, Tailwind CSS 4, PWA-enabled (no service worker yet)
- **Features**: Salary input (solo/dual), 50/30/20 ratio calculator (customizable), visual breakdown with stacked bar charts
- **Components**: `App.jsx`, `SalaryInput.jsx`, `BudgetBreakdown.jsx`, `RatioSettings.jsx` (~350 lines total)
- **Locale**: Israeli Shekel (NIS), Hebrew locale number formatting
- **No**: backend, database, routing, auth, data persistence, expense tracking

### Source files to preserve and evolve
- `/src/App.jsx` - Central component with state management for salaries, ratios, dual mode
- `/src/components/BudgetBreakdown.jsx` - Category model (Needs/Wants/Savings), subcategory definitions, color system, stacked bar visualization
- `/src/components/RatioSettings.jsx` - Budget ratio configuration with validation (must sum to 100%)
- `/src/components/SalaryInput.jsx` - Income input pattern with shekel formatting and dual-mode conditional rendering
- `/public/manifest.json` - PWA configuration to be expanded

---

## TIER 1: CORE FEATURES (MVP)

Minimum features to transform Budgy from a calculator into a usable budget management app.

---

### 1.1 Onboarding & Household Setup

#### 1.1.1 Welcome Flow
- Brief onboarding sequence (3-4 screens max) explaining what Budgy does
- Skip option at every step

#### 1.1.2 Household Mode Selection
- Choose "Just me" (solo) or "Two of us" (partner/household) - replaces the current top-of-page toggle, becomes a persistent setting
- If dual mode:
  - Name or nickname for each person (replaces all "Person 1" / "Person 2" labels)
  - Optional avatar/emoji/color per person for quick visual identification

#### 1.1.3 Income Configuration
- Builds on existing `SalaryInput.jsx`
- **Salary mode per person** — chosen during onboarding, changeable in settings. In dual mode, each person picks independently:
  - **Fixed salary** ("Global") — set once, applies to every month automatically. No monthly prompt. Budget always uses this amount. Updated manually in settings when salary changes (e.g., after a raise). Ideal for salaried employees with a consistent monthly paycheck.
  - **Variable salary** — triggers the monthly salary entry prompt (section 1.1.4). Ideal for hourly workers, freelancers, or anyone whose pay fluctuates month to month.
- **Monthly salary amount** per person — in Fixed mode this is the permanent amount; in Variable mode this is the default pre-fill for monthly prompts
- Pay frequency option (monthly, bi-weekly, weekly) with auto-normalization to monthly
- Income saved persistently and editable from settings

#### 1.1.4 Monthly Salary Entry Prompt
Designed for users with **Variable salary mode** (see 1.1.3). Users with Fixed salary mode skip this entirely — their income auto-populates each month.
- **Recurring prompt**: at the start of each budget period, the app prompts the user to enter that month's actual salary
- **Configurable prompt date**: choose when the prompt appears — **1st of the month**, **10th of the month** (common Israeli pay dates), or a **custom date** — set during onboarding and changeable in settings
- **Pre-filled with last month's salary**: for quick confirmation if income hasn't changed — just tap "Confirm" or adjust the number
- **Dual mode**: prompts only for people set to Variable salary mode (each can confirm/update independently)
- **Dismissible**: can be snoozed or skipped — salary can always be entered/updated later from settings or the dashboard
- **Per-month income history**: each month stores its own actual income, so budget calculations always reflect real earnings — not a static estimate. For Fixed salary users, monthly records are auto-generated from the global amount.
- **Dashboard reminder**: only shown for Variable salary users who haven't entered/confirmed income for the current period ("Enter this month's salary to see your budget")
- Budget category amounts (Essentials/Lifestyle/Savings) automatically recalculate when the month's salary is entered or updated

#### 1.1.5 Budget Ratio Configuration
- Builds on existing `RatioSettings.jsx`
- Essentials/Lifestyle/Savings percentages (default 50/30/20)
- Must sum to 100% (existing validation)
- Saved persistently

#### 1.1.6 Budget Period
- Monthly by default (calendar month: 1st to end of month)
- Option to set a custom cycle start date (e.g., "15th to 14th") to align with pay dates - common in Israel where salaries arrive around the 9th-10th

---

### 1.2 Category & Subcategory Management

#### 1.2.1 Three Core Budget Categories (Fixed)
- **Essentials** (fixed costs, necessities) - was "Needs"
- **Lifestyle** (discretionary, personal enjoyment) - was "Wants"
- **Savings** (savings, investments, debt repayment)
- Tied to the budget ratio system; cannot be deleted but display names are customizable
- Default names: Essentials / Lifestyle / Savings

#### 1.2.2 Subcategories
Current app hardcodes subcategories as display-only pills. These become functional, user-manageable subcategories.

**Default subcategories provided at onboarding:**
- **Essentials**: Rent/Mortgage, Utilities (electric, water, gas), Groceries, Transportation, Insurance, Healthcare, Childcare/Education
- **Lifestyle**: Dining Out, Entertainment, Subscriptions, Shopping/Clothing, Hobbies, Personal Care, Travel/Vacations
- **Savings**: Emergency Fund, Investments, Retirement, Debt Repayment, Specific Savings Goals

**User actions:**
- Add, rename, reorder, and archive (soft-delete) subcategories
- Move a subcategory between top-level categories (e.g., "dining out" from Wants to Needs)
- Each subcategory has an emoji/icon from a predefined set

#### 1.2.3 Optional Subcategory Budgets
- Optionally set a specific monthly budget for individual subcategories (e.g., "Groceries: 2,000 NIS/month")
- If not set, subcategory shares the parent category's pooled budget
- Subcategory budgets cannot exceed parent category total

---

### 1.3 Expense Tracking

#### 1.3.1 Manual Expense Entry
- Prominent "Add Expense" button accessible from every screen (FAB or persistent nav)
- **Fields:**
  - **Amount** (required) - numeric input with shekel symbol
  - **Category** (required) - Essentials/Lifestyle/Savings
  - **Subcategory** (required) - from chosen category's subcategories
  - **Who paid** (required in dual mode; hidden in solo) - Person 1, Person 2, or Split
  - **Split details** (when "Split" chosen) - equal 50/50 by default, or custom split (70/30, specific amounts)
  - **Date** - defaults to today, can be backdated
  - **Note/description** (optional) - free text
  - **Recurring flag** - "Make this recurring" toggle (see section 1.4)
- **Quick-add mode**: simplified flow - just amount, category, who paid. Subcategory and note can be added later

#### 1.3.2 Expense List View
- Chronological list of all expenses for the current budget period
- Each row: date, amount, subcategory icon + name, who-paid indicator (person color/avatar), note preview
- **Filter by**: category, subcategory, person, date range
- **Sort by**: date (newest/oldest), amount (highest/lowest)
- **Search**: free text across notes and subcategory names
- Tap to view full details; swipe or tap to edit/delete

#### 1.3.3 Edit & Delete Expenses
- All fields modifiable
- Delete shows confirmation dialog
- Editing a recurring expense instance: ask whether to edit just this instance or all future instances

#### 1.3.4 Validation
- Amount must be positive and non-zero
- Date cannot be in the future (or optionally allow scheduled future expenses)
- Warn (don't block) if expense pushes a category over budget

---

### 1.4 Recurring / Permanent Payments

#### 1.4.1 Recurring Expense Setup
- Mark any expense as recurring during creation
- **Recurrence options:**
  - Monthly (on a specific day)
  - Weekly (on a specific day of week)
  - Bi-weekly
  - Yearly (annual subscriptions, insurance)
  - Custom interval (every N days/weeks/months)
- Start date and optional end date

#### 1.4.2 Recurring Expense Management
- Dedicated "Recurring Payments" screen listing all active recurring expenses
- Each entry: name/note, amount, frequency, category, who pays, next occurrence
- Actions: edit, pause (stop without deleting), resume, delete

#### 1.4.3 Auto-Generation of Instances
- At the start of each budget period (or when app is opened), recurring expenses auto-generate as pending instances
- Visually distinguished with a "recurring" badge/icon
- User can: confirm, skip (for this period), or adjust the amount (e.g., variable utility bills)

#### 1.4.4 Common Templates
- During onboarding or from recurring payments screen, offer templates:
  - Rent/Mortgage, Electricity, Water, Gas, Internet, Phone
  - Streaming services (Netflix, Spotify, etc.)
  - Gym membership, Insurance (car, health, home)
  - Public transit pass (Rav-Kav monthly)
- Templates pre-fill category, subcategory, and recurrence interval - user enters amount and who pays

---

### 1.5 Two-Person Household Management & Settlements

#### 1.5.1 "Who Paid" Tracking
- Every expense records who actually paid (Person 1, Person 2, or Split)
- "Paid by" is separate from "whose responsibility" - this distinction drives settlement calculation

#### 1.5.2 Personal vs. Shared Expenses
- Each expense tagged as **Shared** (both people share cost) or **Personal** (only the payer is responsible)
- Defaults: Shared for Needs, Personal for Wants, configurable for Savings
- Personal expenses do NOT factor into settlement balance

#### 1.5.3 Settlement / "Who Owes Who" Dashboard
- Dedicated screen or prominent section showing:
  - **Running balance**: how much Person A owes Person B (or vice versa)
  - Calculation: for each shared expense, each person owes their split share. If Person 1 paid a 200 NIS shared expense with 50/50 split, Person 2 owes Person 1 100 NIS. Sum all obligations.
  - Clear, large display: "[Name] owes [Name] X NIS" or "You're settled up!"
- **Mini-ledger**: history of each shared expense and who paid, with running total
- **"Settle Up" action**: records a settlement payment, adjusting the balance. Logged as a settlement event, not an expense

#### 1.5.4 Split Method Options
- **Equal split (50/50) - DEFAULT**: both people owe the same amount regardless of income
- **Proportional to income** (alternative): if Person 1 earns 60% of household income, shared expenses split 60/40 (auto-calculated from salary inputs)
- **Custom fixed percentage** (alternative): user sets any ratio (e.g., 70/30)
- Chosen method applies globally, with per-expense override capability
- Can be changed anytime in settings

#### 1.5.5 Settlement History
- Log of all "settle up" events with date and amount
- Option to settle up partially

---

### 1.6 Dashboard & Overview

#### 1.6.1 Main Dashboard (Home Screen)
Replaces the current single-view calculator.
- Current budget period at top (e.g., "March 2026") with month navigation
- **Budget summary cards** per category:
  - Budget amount
  - Amount spent so far
  - Amount remaining
  - Visual progress bar (green -> yellow -> red as spending approaches/exceeds budget)
  - Percentage used
- Total income vs. total spending for the month
- "Add Expense" quick-access button
- In dual mode: settlement balance card ("Omer owes Shira 340 NIS")
- Recent expenses: last 3-5 entries

#### 1.6.2 Category Detail View
- Tap a category card to drill down:
  - Subcategory breakdown (bar chart or list)
  - Subcategory budget progress (if set)
  - Expense list for this category in current period
  - In dual mode: per-person spending breakdown (evolving the existing stacked bar)

---

### 1.7 Data Persistence

#### 1.7.1 Local Storage
- All data persisted locally (localStorage / IndexedDB)
- Survives page refreshes and app restarts
- No backend required for MVP

#### 1.7.2 Data Integrity
- Graceful fallback to defaults if data is corrupted/missing
- Schema migration layer for app version upgrades

---

### 1.8 Navigation

#### 1.8.1 Tab-Based Navigation
Bottom nav bar (mobile-first):
- **Dashboard** (home)
- **Expenses** (list view)
- **Add Expense** (center, prominent)
- **Recurring Payments**
- **Settlement** (dual mode only; hidden in solo)

#### 1.8.2 Client-Side Routing
- Each screen has a URL for browser back/forward and deep linking

---

### 1.9 Settings

#### 1.9.1 Household Settings
- Switch solo/dual mode, edit person names/avatars, edit default income, change budget period start date
- **Salary mode per person**: switch between Fixed and Variable salary mode at any time
- **Fixed salary amount**: update the global salary (e.g., after a raise) — takes effect from the current month onward
- **Salary prompt date** (Variable mode only): change when the monthly salary entry prompt appears (1st, 10th, or custom day)
- **Edit current month's salary**: manually update this month's income at any time (both modes)

#### 1.9.2 Budget Settings
- Edit 50/30/20 ratios, change split method for shared expenses

#### 1.9.3 Category Settings
- Manage subcategories (add, rename, reorder, archive, move between categories)
- Set default Shared vs. Personal per category

#### 1.9.4 Display Settings
- Currency symbol (NIS default, configurable)
- Locale formatting preferences

---

## TIER 2: ENHANCED FEATURES (Post-MVP, High Priority)

---

### 2.1 Reports & Analytics

#### 2.1.1 Monthly Summary Report
- Total income, total spent, total saved
- Per-category spending vs. budget with charts (pie, bar)
- Over/under budget highlights
- Settlement summary (dual mode)

#### 2.1.2 Trends Over Time
- Line/bar charts showing spending by category across months
- Trend identification ("Wants spending increased 15% over last 3 months")
- Average monthly spending per category

#### 2.1.3 Subcategory Analytics
- Drill into any subcategory for spending over time
- Top subcategories by spending amount
- "Where does your money go?" visualization

#### 2.1.4 Income vs. Expenses Over Time
- Net savings/deficit per month as timeline chart
- Rolling average savings rate

#### 2.1.5 Per-Person Spending Breakdown (Dual Mode)
- How much each person is spending total and per category
- Comparison view: Person 1 vs. Person 2 patterns

---

### 2.2 Enhanced Recurring Payments

#### 2.2.1 Variable Amount Tracking
- For bills that change (utilities, phone): store history of past amounts, show average
- Auto-generation uses last known amount, prompts user to update

#### 2.2.2 Upcoming Bills Calendar View
- Calendar or timeline showing when recurring payments are due in coming days/weeks

#### 2.2.3 Recurring Income
- ~~Moved to Tier 1 (section 1.1.4)~~ — monthly salary entry prompt now handles variable income natively
- For freelancers with multiple income sources: ability to add additional one-off income entries for a given month (e.g., freelance gig, side project payment)

---

### 2.3 Budget Flexibility

#### 2.3.1 Rollover Unused Budget
- Carry forward unused budget from one month to the next within a category
- Per-category toggleable setting

#### 2.3.2 Mid-Month Reallocation
- Move budget between categories for the current period without changing underlying ratios
- Logged as a "budget adjustment" so it's visible as an exception

---

### 2.4 Data Export & Backup

#### 2.4.1 CSV Export
- Export expenses for any date range as CSV
- All fields: date, amount, category, subcategory, who paid, shared/personal, note

#### 2.4.2 Manual Backup & Restore
- Export all app data as JSON file
- Import/restore from previous export
- Warning that restore overwrites current data

---

### 2.5 Notifications & Reminders

#### 2.5.1 Budget Threshold Alerts
- Alerts when category spending reaches 80%, 90%, 100% of budget
- In-app notifications + browser push notifications (if granted)

#### 2.5.2 Recurring Expense Reminders
- Reminder before recurring expense is due (1 day, 3 days, on the day - configurable)

#### 2.5.3 End-of-Period Reminder
- Reminder a few days before budget period ends to review and settle up

#### 2.5.4 Expense Logging Nudge
- If no expenses logged in N days (default 3), gentle reminder

---

### 2.6 UX Enhancements

#### 2.6.1 Dark Mode
- Full dark theme, togglable in settings
- Respect OS preference (`prefers-color-scheme`) by default

#### 2.6.2 RTL (Right-to-Left) Support
- Full RTL layout for Hebrew
- All text alignment, navigation flow, chart directionality adapts
- Toggle between LTR (English) and RTL (Hebrew)

#### 2.6.3 Accessibility
- Semantic HTML, proper ARIA attributes
- Keyboard-navigable, screen reader compatible
- Color-blind-friendly: never rely on color alone

#### 2.6.4 Quick Actions
- **Favorite/frequent expenses**: track common entries, offer one-tap re-entry
- **Duplicate expense**: pre-fill all fields from existing expense
- **Batch operations**: select multiple expenses to delete, re-categorize, or change who-paid

---

### 2.7 Multi-Month History

#### 2.7.1 Budget Period Archive
- Auto-archive each completed month
- Browse past months as read-only snapshots

#### 2.7.2 Month Navigation
- Swipe or arrow buttons on dashboard to navigate months
- Current month always the default landing view

---

## TIER 3: FUTURE / ASPIRATIONAL FEATURES

---

### 3.1 Multi-Device Sync & Authentication
- Optional user accounts (email/social login) for cloud sync
- App remains fully functional without an account (local-only)
- Both people in dual mode can link accounts to same household
- Real-time collaboration: expenses appear for partner instantly
- Push notification to partner when shared expense is logged

### 3.2 Smart / AI-Powered Features
- **Categorization suggestions**: when typing a note (e.g., "Shufersal"), suggest likely category/subcategory from past behavior
- **Spending insights**: AI-generated monthly insights ("20% more on dining out vs. 3-month average")
- **Budget forecasting**: based on current pace, predict if user will stay within budget ("At current rate, you'll exceed Wants by ~300 NIS")
- **Anomaly detection**: flag unusual expenses

### 3.3 Payment Detection & Push Notifications (Native App Only)
- If Budgy becomes a native app (React Native / Capacitor):
  - Detect Apple Pay / Google Pay / credit card transaction notifications
  - Push notification: "Did you just spend 87 NIS? Tap to log it"
  - Pre-fill amount, user just selects category
- **SMS/Bank notification parsing**: parse incoming bank SMS to detect transactions (on-device only, no server)
- **Open Banking integration**: auto-import transactions from bank accounts (significant regulatory undertaking)

### 3.4 Savings Goals
- Define specific goals: "Vacation - 8,000 NIS", "Emergency Fund - 20,000 NIS"
- Target amount, optional deadline, monthly contribution target
- Visual progress tracking
- Allocate portion of Savings budget to specific goals

### 3.5 Debt Tracking
- Track debts: credit card balances, loans, personal debts
- Each debt: name, total owed, interest rate, minimum monthly payment
- Payoff projections and strategy suggestions (snowball vs. avalanche)

### 3.6 Multi-Currency Support
- Support currencies beyond NIS
- Auto-convert foreign currency expenses using current exchange rates

### 3.7 Widgets & Quick Access (Native/PWA)
- Home screen widget showing budget remaining or total spending
- Apple Watch / Wear OS companion for quick expense logging

### 3.8 Receipt Scanning
- Camera-based receipt capture with OCR
- Extract total amount, date, store name
- Auto-fill expense form, store receipt image

### 3.9 Shared Shopping Lists
- Shopping list tied to Groceries subcategory
- Convert completed list into an expense

### 3.10 Localization
- Full Hebrew translation (currently English UI with Hebrew number formatting)
- Regional defaults: arnona, va'ad bayit, kupat cholim for Israeli users
- Architecture for additional languages

### 3.11 Gamification
- Monthly achievements/badges: staying within budget, consistent logging, hitting savings goals
- Streak tracking: consecutive months under budget

### 3.12 Advanced Household Models
- **3+ people**: roommate households with N-way expense splitting
- **Multiple budget pools**: joint account + individual budgets modeled separately

---

## CROSS-CUTTING UX PRINCIPLES

- **Mobile-first**: all layouts optimized for phones (budget logging happens on-the-go). Desktop works but is secondary
- **Speed of entry**: adding an expense must take under 10 seconds. Minimize taps and transitions
- **Visual clarity**: color, icons, progress bars. Users understand budget status at a glance
- **Non-judgmental tone**: never shame users. "You've used 95% of your Wants budget" not "You overspent!"
- **Graceful empty states**: every list/screen has a helpful empty state, not a blank page
- **Consistent formatting**: `he-IL` locale, NIS symbol, thousands separators, no decimal places (Israeli convention)

---

## DATA MODEL CONCEPTS (Developer Reference)

Core entities the developer should design around:

| Entity | Key Fields |
|---|---|
| **Household** | mode (solo/dual), person names/avatars, split method preference |
| **Income** | per-person salary mode (fixed/variable), monthly net income amount, pay frequency, salary prompt date (1st/10th/custom — variable mode only) |
| **Monthly Income Entry** | budget period (month/year), per-person actual income for that period, entry date, confirmed flag, source (manual / auto-from-fixed) |
| **Budget Config** | ratios (needs/wants/savings %), period start day, rollover preferences |
| **Category** | fixed three (essentials/lifestyle/savings), customizable display names |
| **Subcategory** | belongs to category, name + emoji, user-orderable, archivable |
| **Expense** | amount, date, category, subcategory, who-paid, shared/personal, split details, note, recurring-instance flag, link to recurring template |
| **Recurring Template** | amount, frequency, day-of-month/week, start/end date, category, subcategory, who-pays, active/paused |
| **Settlement Event** | date, amount, from-person, to-person, note |
| **Budget Period Snapshot** | archived monthly data for historical views |

---

## PLATFORM STRATEGY

| Phase | Approach |
|---|---|
| **MVP** | Keep as PWA. Add service worker for offline support. Fastest path to value. |
| **Post-MVP** | Evaluate Capacitor or React Native for native capabilities (push notifications, payment detection, SMS parsing, widgets) |
| **Backend** | Not needed for MVP (local storage only). Cloud sync comes in Tier 3. |

---

## MIGRATION FROM CURRENT APP

- Existing salary input, ratio settings, and breakdown visualizations should be **preserved and enhanced**, not discarded
- Budget breakdown cards evolve from existing design, gaining spending-vs-budget tracking on top of ratio calculation
- Dual-mode toggle transitions from a UI toggle to a persistent onboarding/settings choice
- Color system and category metadata from `BudgetBreakdown.jsx` should carry forward

---

## VERIFICATION

To validate the completed app:
1. **Onboarding**: complete setup flow in both solo and dual mode
2. **Expense entry**: add expenses in all categories, verify they appear in list and affect budget progress bars
3. **Recurring payments**: create recurring expenses, advance time or trigger auto-generation, verify instances appear
4. **Settlement**: in dual mode, log shared expenses paid by different people, verify "who owes who" balance is correct. Perform a settle-up and verify balance adjusts
5. **Budget tracking**: verify progress bars and remaining amounts update correctly as expenses are added
6. **Persistence**: refresh the page and verify all data survives
7. **Navigation**: verify all tabs/routes work, browser back/forward functions correctly
8. **Edge cases**: zero income, 100% in one ratio category, both people paying for same split expense, deleting the only expense in a category
