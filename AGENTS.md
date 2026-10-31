# KELO WOOD MARKET

The user requires every completed site change to be saved to GitHub: `krest0208/KeloMarket`, branch `main`. This is continuing authorization to update this repository after changes requested in this project. Preserve its existing visibility and history.

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
- Text-only navigation and purchase buttons; no arrow icons.
- 3D previews and GLB download buttons are currently disabled at the user's request.
- Board orders use the explicitly confirmed maximum length of 150 cm and maximum finished width of 400 mm, with 30/40 mm thickness and the length slider directly below the image and a quantity control.
- Separate “Заказать доску” and “Заказать товар” modes.
- Gift wrapping and a shelf-support set cost 300 RUB each per item.
- Keep demo prices/images clearly labelled; YooKassa and Yandex Delivery are not connected.

- Category cards are gray, with six photos per gallery. Editorial sections use separate photos, never repeated category covers.
- Header navigation uses dark buttons with a small 8–10 px radius. The announcement strip is removed.
- Thickness selection belongs below the board image with length and quantity.
- Include a section with examples of furniture and interior uses for Kelo boards.
