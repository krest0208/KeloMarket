import {z} from 'zod';

export const REVIEW_PAGE_SIZE = 10;
export const REVIEW_BODY_LIMIT = 8192;
const printableName = (value: string) => !/[\u0000-\u001f\u007f]/.test(value);
const printableText = (value: string) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
export const reviewProductId = z.string().trim().min(1).max(50).regex(/^[A-Za-z0-9][A-Za-z0-9_-]*$/);
export const reviewInput = z.object({
  requestId: z.string().uuid(),
  productId: reviewProductId,
  name: z.string().trim().min(2).max(60).refine(printableName),
  text: z.string().trim().min(10).max(2000).refine(printableText),
}).strict();
export const signedInReviewInput = reviewInput.omit({name: true});
export type ReviewInput = z.infer<typeof reviewInput>;
export interface ProductReview {id: string; productId: string; name: string; text: string; createdAt: string}
export interface ReviewPage {reviews: ProductReview[]; total: number; hasMore: boolean}

/** Kitchen shelf is a distinct use-case/review target, not an invented stock SKU. */
export async function reviewTargetExists(db: D1Database, productId: string) {
  if (!reviewProductId.safeParse(productId).success) return false;
  const stockId = productId === 'kitchen-shelf' ? 'PL-001' : productId;
  return !!await db.prepare('SELECT id FROM products WHERE id=? AND active=1').bind(stockId).first();
}

const columns = 'id, product_id AS productId, author_name AS name, body AS text, created_at AS createdAt';
export async function listProductReviews(db: D1Database, productId: string, offset = 0): Promise<ReviewPage> {
  if (!Number.isInteger(offset) || offset < 0 || offset > 10000) throw new Error('Invalid review offset');
  const [page, count] = await Promise.all([
    db.prepare(`SELECT ${columns} FROM product_reviews WHERE product_id=? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`).bind(productId, REVIEW_PAGE_SIZE + 1, offset).all<ProductReview>(),
    db.prepare('SELECT COUNT(*) AS total FROM product_reviews WHERE product_id=?').bind(productId).first<{total: number}>(),
  ]);
  const rows = page.results || [];
  return {reviews: rows.slice(0, REVIEW_PAGE_SIZE), total: Number(count?.total || 0), hasMore: rows.length > REVIEW_PAGE_SIZE};
}

export class ReviewConflict extends Error {}
export class ReviewDuplicate extends Error {}

export async function saveProductReview(db: D1Database, input: ReviewInput, now = new Date(), userId: string | null = null): Promise<{review: ProductReview; created: boolean}> {
  const body = reviewInput.parse(input);
  const existing = await db.prepare(`SELECT ${columns}, user_id AS userId FROM product_reviews WHERE id=?`).bind(body.requestId).first<ProductReview & {userId: string | null}>();
  if (existing) {
    if (existing.productId !== body.productId || existing.name !== body.name || existing.text !== body.text || existing.userId !== userId) throw new ReviewConflict();
    const {userId: _privateIdentity, ...publicReview} = existing;
    return {review: publicReview, created: false};
  }
  // One atomic statement also rejects an accidental identical submission with a
  // new request UUID. The account ID stays private in storage; public responses
  // contain only the displayed name, review text and date.
  const createdAt = now.toISOString();
  const recent = new Date(now.getTime() - 60000).toISOString();
  await db.prepare(`INSERT OR IGNORE INTO product_reviews(id, product_id, author_name, body, created_at, user_id)
    SELECT ?,?,?,?,?,? WHERE NOT EXISTS (
      SELECT 1 FROM product_reviews WHERE product_id=? AND user_id IS ? AND author_name=? AND body=? AND created_at>=?
    )`).bind(body.requestId, body.productId, body.name, body.text, createdAt, userId, body.productId, userId, body.name, body.text, recent).run();
  const review = await db.prepare(`SELECT ${columns}, user_id AS userId FROM product_reviews WHERE id=?`).bind(body.requestId).first<ProductReview & {userId: string | null}>();
  if (!review) throw new ReviewDuplicate();
  if (review.productId !== body.productId || review.name !== body.name || review.text !== body.text || review.userId !== userId) throw new ReviewConflict();
  const {userId: _privateIdentity, ...publicReview} = review;
  return {review: publicReview, created: true};
}
