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

- The homepage has one generic board description card with a Заказать link to /constructor. Do not restore category cards, the featured product grid, or the embedded homepage configurator. Public /catalog shows the same generic board overview. Galleries on retained product routes have five or six photos. The round coffee-table photo formerly named slabs-room was removed at the user's request. Editorial sections use separate photos, never repeated category covers.
- Header navigation uses dark buttons with a small 8–10 px radius. The announcement strip is removed.
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
