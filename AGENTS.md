# KELO WOOD MARKET

The user requires every completed site change to be saved to GitHub: `krest0208/KeloMarket`, branch `main`. This is continuing authorization to update this repository after changes requested in this project. Preserve its existing visibility and history.

## Start with the current context

- Read `docs/PROJECT_CONTEXT.md` for architecture, product decisions, routes and the distinction between source behavior and verified runtime behavior.
- Read `docs/OPEN_TASKS.md` for unresolved business rules and launch requirements. Read `docs/IMAGE_AUDIT.md` for the image audit's actual scope, replacements and verification results; do not infer completion from a plan or generated files.
- Keep these documents and `README.md` current when a task changes their facts. User instructions in the current conversation take precedence over older documentation.
- This is the React/TypeScript/Vinext/Cloudflare project. Earlier discussions of a standalone Node.js `server.js` deployment do not describe this checkout.

## Independent work

The user explicitly requests separate agents or isolated branches for independent tasks. Assign disjoint file ownership before parallel edits, or use separate worktrees/branches and integrate reviewed changes. One coordinating agent owns integration, Sites publication and the final GitHub ref update. Do not overwrite another task's files or publish a partial parallel result. Preserve unrelated working-tree changes and inspect concurrent remote changes before retrying a push.

## Finish every change

1. Implement and validate the requested change, including the conversation preview when it exists.
2. Use the Sites source helper and preserve project `appgprj_6ae5db0e48b08191b083473315b59dc8` and its owner-only site audience. Publish unless the user requests otherwise.
3. Run `node scripts/prepare-github-sync.mjs manifest` after the Sites source commit is created. It exports the exact committed tree and checks the tracked files for accidental secrets. Generated sync data belongs in ignored `work/`, not in the repository.
4. Use the connected GitHub plugin to read the current `main` head and its recursive tree. Reuse blob SHAs already present in that repository. Read batches with `node scripts/prepare-github-sync.mjs batch N`; create missing binary blobs with `create_blob` and encoding `base64`, and missing text blobs with encoding `utf-8`. Never print file payloads, credentials, or tokens in chat.
5. Create a tree with the complete manifest's paths, modes, and verified blob SHAs. Its SHA must equal `source_tree` in the manifest. Create a commit with the current GitHub head as its parent and update `main` using `expected_sha`. Preserve concurrent remote work; if the lease fails, inspect it before retrying. Do not force push.
6. Verify the GitHub branch head and committed tree. Report success only after the remote update succeeds. If it cannot complete, say clearly that GitHub sync is pending and why.

Never upload credentials, environment values, local database contents, customer orders, `.git`, `node_modules`, build output, or ignored workspace data. Runtime D1/R2 data is not part of the source backup.

## Product preferences

- Black background and pale wood-yellow actions with dark button text.
- Navigation and purchase buttons have text and no arrow icons. The header cart is a prominent pale wood-yellow ShoppingBag icon with an accessible label and quantity badge.
- No underlines on buttons or links, including hover/focus states. Use Motion for animations; respect reduced motion. Galleries support horizontal swipes, and product detail/lightbox photos also use the mouse wheel without trapping the page at the ends.
- 3D previews and GLB download buttons are currently disabled at the user's request.
- Board orders use the explicitly confirmed maximum length of 150 cm and maximum finished width of 400 mm, with 30/40 mm thickness and the length slider directly below the image in 1 cm increments with a brief 120 ms detent at each multiple of 10 while dragging; clicks, keyboard input and manual values retain exact centimeter control and a quantity control.
- Separate “Заказать доску” and “Заказать товар” modes.
- Gift wrapping and a shelf-support set cost 300 RUB each per item.
- Keep demo prices/images clearly labelled; YooKassa and Yandex Delivery are not connected.

- The homepage has one generic board description card with a Заказать link to /constructor, plus the newly requested Изделия section (shelf, windowsill, kitchen shelf) and dynamically created products. Do not restore the old category grid or embedded homepage configurator. Public /catalog shows the same generic board overview. Galleries on retained product routes have five or six photos. The round coffee-table photo formerly named slabs-room was removed at the user's request. Editorial sections use separate photos, never repeated category covers.
- Main and secondary navigation belong to one full-width sticky header. Navigation links form continuous rectangular regions with transparent backgrounds and very subtle dividers; do not restore separate rounded pills or a floating secondary panel. “Мы на WB” is a prominent pale wood-yellow region. Preserve accessible mobile navigation, keyboard focus and the cart. The announcement strip is removed.
- Thickness selection belongs below the board image with length and quantity.
- Include a section with examples of furniture and interior uses for Kelo boards.

## Board imagery: binding product requirements

- Products are elongated, relatively flat Kelo pine boards, normally 30 or 40 mm thick. Both broad faces (top and bottom) are flat, sanded and polished. Keep the two natural irregular live edges unless a selected straight cut explicitly calls for one side to be cut.
- Keep realistic Kelo pine color, grain, knots and natural features. Do not show cylindrical logs, round timber, unprocessed trunks, or oversized beams as the finished product. Do not replace the live edges with two straight construction-lumber sides.
- Audit all relevant surfaces: homepage/editorial blocks, `/catalog`, retained `/product/[id]` galleries, `/constructor` and its SVG texture, product selectors, cart/checkout thumbnails, and any other image consumers. Distinguish a forest/background image from a product image. Record inaccessible runtime-uploaded images separately instead of claiming they were reviewed.
- Replace only images that fail the product brief. Preserve good images, the dark brand style, framing, camera intent and existing page structure. Keep generated images marked as demonstrations; they are not evidence of actual inventory.
- Inspect every replacement at useful resolution, including visible top, lower plane/edge and natural sides. A hidden underside cannot be declared visually inspected; record the visibility limit. Inspect mobile and desktop framing and image loading, and verify publication before reporting live success.
- Count unique source pictures, not occurrences, thumbnails, format conversions or repeated use across routes. Record source path, reason for replacement, sections, replacement identity and verification status in `docs/IMAGE_AUDIT.md`. A generated but unintegrated or unreviewed image is not a completed fix.

## Pending decisions: do not silently invent business rules

- The user requests a minimum length of 20 cm; current source still uses 30 cm in shared limits, UI and order validation. The maximum remains 150 cm. This is an open implementation task, not a completed change.
- The requested tariff is inconsistent: 200 RUB/m makes 150 cm cost 300 RUB, while 3000 RUB for 150 cm requires 2000 RUB/m. Obtain the intended tariff before replacing demo rates.
- Preserve the user's pricing examples exactly: 30.4 cm charged as 30 cm; 30.5 cm charged as 40 cm. The general billing rule and fractional input still need agreement/implementation. Do not substitute standard rounding to the nearest 10 cm; current input and API accept integer centimeters.
- The product is already polished on top and bottom, but current checkout still offers optional paid sanding. Resolve what additional service, if any, that option represents before changing its commercial meaning.
- Image and documentation work must not silently change prices, dimensions, stock, customer orders or the Site audience.

## Editable site and inventory

- Header/mobile/footer expose Изделия (`/products`) and Мы на WB (exact URL in `lib/site-navigation.ts`). New buyer-facing routes and cards must keep real review forms and availability labels. Do not fabricate reviews.
- The owner manages text via `/admin` → Редактировать на странице (visual editor) or Тексты сайта, using the registry in `lib/site-content.ts`. Preserve stable copy keys when changing defaults. Source defaults stay readable when CMS fetching fails. New products are created in the existing admin panel and become visible on the additional products grid with the same constructor/cart/gallery/reviews flow.
- `/admin` requires the application's own username/password session; `/Admin` redirects there. Never restore header-only or DEV admin bypass. Real credentials stay only in runtime variables `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, never GitHub.
- Tracked `stockUnits` counts complete configured items. An order reserves quantity in units, cancellation returns it once; `remainingCm` is a per-item dimension limit. Legacy rows with NULL units retain centimeter-based reservation until the owner sets actual counts. Do not invent counts. Buyer APIs/UI expose `inStock`/`stockTracked`, never unit counts.
- Admin product saves use compare-and-swap for original unit and centimeter balances. A stale form must not overwrite a buyer's reservation. Keep atomic order/cancel logic, idempotency and the tests in `tests/inventory.test.ts`.
- D1 migrations are generated with SQL, snapshot and journal metadata. Sites applies them before Worker deployment. Never CREATE/ALTER migration-owned tables during a request.

## Visual editing and customer accounts

- Read [docs/VISUAL_EDITOR.md](docs/VISUAL_EDITOR.md) for editor workflow, iframe protocol, block schema and verification limits. `SiteText` becomes editable only inside an authorized admin frame; a URL parameter never grants write permission. The API checks the real admin session and origin on every write.
- Both visual saves and legacy text saves use one `expectedRevision` and atomic D1 compare-and-swap. Never bypass conflict checks or overwrite a newer layout/content snapshot. Drafts are in memory until Save; do not silently autosave or persist admin drafts in public localStorage.
- The ten built-in homepage blocks keep their identity/functionality; order and visibility are editable. Up to twenty custom text/photo blocks use plain strings, allowlisted local image paths and enum themes/alignment. Never accept arbitrary HTML, JS or CSS. Text remains escaped, including pasted markup.
- `/account` is customer registration/login, separate from `/admin`. Reviews GET stays public, new review POST requires a customer session and takes the author name from that session. Never trust a posted author name or fabricate reviews. Guest checkout must continue to work without a customer account.
- Customer passwords use salted PBKDF2, sessions store only a random token's SHA-256 hash in D1. Cookie is HttpOnly/Secure/SameSite Strict, with expiry/logout/rotation. Rate limits are durable in D1; the HMAC counter key is generated at runtime and never returned by public APIs. No login, password, cookie or runtime secret belongs in source/GitHub.
- Migration `0003_customer_accounts` preserves old reviews with nullable user_id. Account email confirmation, password recovery and verified-purchase labels are not implemented; do not claim them.

## Domain scope

- Only `kelowoodmarket.ru` is authorized for the current REG.RU connection task. Read [docs/DOMAIN_SETUP.md](docs/DOMAIN_SETUP.md) before changing DNS. Do not alter other domains, name servers, mail records or unrelated services. Preserve the Site's existing audience.
- Use the exact DNS records supplied by Sites for this existing custom-domain binding. Do not remove/recreate it to work around a login or propagation delay. Account passwords and authentication cookies must never enter source files, logs or GitHub.
