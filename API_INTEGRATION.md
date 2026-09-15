# API Integration

Every backend call in this app goes through a Server Component or Server Action — never the
browser directly. Base URL: `BACKEND_API_URL`
(server-only env var, see `.env.local`).

## Auth

| Endpoint | Server action | Used by |
|---|---|---|
| `POST /auth/register` | `authAction.ts` (`registerAction`) | `RegisterForm.tsx` |
| `POST /auth/login` | `authAction.ts` (`loginAction`) | `LoginForm.tsx` — also calls `GET /auth/me` right after, to redirect to the right dashboard by role |
| `GET /auth/me` | `Navbar.tsx`, `proxy.ts` (route guard) | every page load, for session/role checks |
| `GET /auth/me` | `properties/[id]/page.tsx`, `dashboard/landlord/properties/page.tsx`, `dashboard/landlord/properties/[id]/photos/page.tsx`, `dashboard/profile/page.tsx` | role/ownership checks, and pre-filling the profile form |
| `PATCH /auth/me` | `authAction.ts` (`updateProfileAction`) | `UpdateProfileForm.tsx` — update name and/or change password; email is immutable |


## Properties (public)

| Endpoint | Server action | Used by |
|---|---|---|
| `GET /properties` | `app/page.tsx`, `properties/page.tsx` | homepage grid, `/properties` browse & filter |
| `GET /properties/:id` | `properties/[id]/page.tsx` | property detail page + photo gallery |
| `GET /properties/:id` | `dashboard/tenant/page.tsx`, `dashboard/landlord/requests/page.tsx` | resolving a property's title for each row in the tenant/landlord request tables |
| `GET /properties/:id` | `dashboard/tenant/requests/[id]/pay/page.tsx` | payment initiation page |
| `GET /properties/:id` | `dashboard/landlord/properties/[id]/photos/page.tsx` | photo upload page |
| `GET /categories` | `app/page.tsx`, `properties/page.tsx` | search filter dropdown |
| `GET /categories` | `dashboard/landlord/properties/new/page.tsx` | create-listing form's category select |
| `GET /categories` | `dashboard/admin/categories/page.tsx` | admin category list |

## Landlord

| Endpoint | Server action | Used by |
|---|---|---|
| `POST /landlord/properties` | `landlordAction.ts` (`createPropertyAction`) | `CreatePropertyForm.tsx` |
| `GET /landlord/properties` | `dashboard/landlord/properties/page.tsx` | "My listings" — the landlord's own properties, any status |
| `PUT /landlord/properties/:id` | `landlordAction.ts` (`updatePropertyAction`) | `EditPropertyForm.tsx` — edit title/description/location/price and availability status |
| `DELETE /landlord/properties/:id` | `landlordAction.ts` (`deletePropertyAction`) | `DeletePropertyButton.tsx` |
| `POST /landlord/properties/:id/images` | `landlordAction.ts` (`uploadPropertyImagesAction`) | `PropertyPhotosManager.tsx` |
| `GET /landlord/requests` | `dashboard/landlord/requests/page.tsx` | "Manage incoming requests" table |
| `PATCH /landlord/requests/:id` | `landlordAction.ts` (`updateRentalRequestStatusAction`) | `RentalRequestActions.tsx` — approve/reject/mark completed |

## Rentals (tenant)

| Endpoint | Server action | Used by |
|---|---|---|
| `POST /rentals` | `tenantAction.ts` (`requestRentalAction`) | `RequestRentalForm.tsx` |
| `GET /rentals` | `dashboard/tenant/page.tsx` | tenant's rental request history table |
| `GET /rentals` | `properties/[id]/page.tsx` | duplicate-request detection (shows status instead of the request form if one already exists) |
| `GET /rentals/:id` | `dashboard/tenant/requests/[id]/pay/page.tsx` | payment initiation page — checks the request is `APPROVED` before showing the pay button |

## Payments

| Endpoint | Server action | Used by |
|---|---|---|
| `POST /payments` | `tenantAction.ts` (`initiatePaymentAction`) | `PayButton.tsx` — redirects the browser to the returned Stripe Checkout URL |
| `GET /payments` | `dashboard/tenant/page.tsx` | payment history table + per-request "Pay now / Payment pending / Paid" status |
| `GET /payments` | `dashboard/tenant/requests/[id]/pay/page.tsx` | checks for an existing payment before showing the pay button again |
| `GET /payments/:id` | `dashboard/tenant/payments/[id]/page.tsx` | payment detail page (amount, provider, method, transaction id, timestamps) — linked from a "View" link on the payment history table |

Stripe's own webhook (`checkout.session.completed`) is handled entirely server-side by the
backend — the frontend's `/payment/success` and `/payment/cancel` pages are static
confirmation screens at the exact paths Stripe redirects back to; they don't poll or call any
endpoint themselves.

## Reviews

| Endpoint | Server action | Used by |
|---|---|---|
| `POST /reviews` | `tenantAction.ts` (`createReviewAction`) | `ReviewForm.tsx` — gated to rental requests with status `COMPLETED` |

No endpoint exists to list or fetch reviews (not even by property), so there is no
review-display UI anywhere in the app — a review is write-only from the frontend's perspective.

## Admin

| Endpoint | Server action | Used by |
|---|---|---|
| `POST /admin/categories` | `adminAction.ts` (`createCategoryAction`) | `CreateCategoryForm.tsx` |
| `GET /admin/users` | `dashboard/admin/users/page.tsx` | user list, with client-side search + pagination |
| `GET /admin/users` | `dashboard/admin/page.tsx` | overview page's "Total users" stat card |
| `PATCH /admin/users/:id` | `adminAction.ts` (`updateUserStatusAction`) | `UserStatusAction.tsx` — ban/unban |
| `GET /admin/properties` | `dashboard/admin/properties/page.tsx` | full platform property list, any status |
| `GET /admin/properties` | `dashboard/admin/page.tsx` | overview page's "Total properties" stat card |
| `GET /admin/rentals` | `dashboard/admin/rentals/page.tsx` | full platform rental request list |
| `GET /admin/rentals` | `dashboard/admin/page.tsx` | overview page's "Pending requests" stat card (filtered client-side, since there's no count endpoint) |
