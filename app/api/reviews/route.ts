import {ensureSeed, errorResponse, rawDb, sameOrigin} from '@/lib/store-server';
import {listProductReviews, REVIEW_BODY_LIMIT, ReviewConflict, ReviewDuplicate, reviewInput, reviewProductId, reviewTargetExists, saveProductReview} from '@/lib/reviews';

const response = (data: unknown, status = 200) => Response.json(data, {status, headers: {'Cache-Control': 'no-store'}});

export async function GET(req: Request) {
  const query = new URL(req.url).searchParams;
  const product = reviewProductId.safeParse(query.get('productId'));
  const rawOffset = query.get('offset') || '0';
  const offset = Number(rawOffset);
  if (!product.success || !/^\d+$/.test(rawOffset) || !Number.isInteger(offset) || offset < 0 || offset > 10000) return errorResponse('Некорректные параметры отзывов.');
  try {
    await ensureSeed();
    const db = rawDb();
    if (!await reviewTargetExists(db, product.data)) return errorResponse('Изделие не найдено.', 404);
    return response(await listProductReviews(db, product.data, offset));
  } catch {
    return errorResponse('Не удалось загрузить отзывы. Попробуйте ещё раз.', 503);
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return errorResponse('Недопустимый источник запроса.', 403);
  if (!req.headers.get('content-type')?.toLowerCase().includes('application/json')) return errorResponse('Отправьте отзыв в формате JSON.', 415);
  const size = Number(req.headers.get('content-length'));
  if (size > REVIEW_BODY_LIMIT) return errorResponse('Отзыв слишком большой.', 413);
  try {
    const reader = req.body?.getReader();
    if (!reader) return errorResponse('Проверьте текст отзыва.');
    const chunks: Uint8Array[] = [];
    let received = 0;
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      received += chunk.value.byteLength;
      if (received > REVIEW_BODY_LIMIT) {await reader.cancel(); return errorResponse('Отзыв слишком большой.', 413);}
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.byteLength;}
    let data: unknown;
    try { data = JSON.parse(new TextDecoder().decode(bytes)); } catch { return errorResponse('Проверьте текст отзыва.'); }
    const parsed = reviewInput.safeParse(data);
    if (!parsed.success) return errorResponse('Укажите имя от 2 до 60 символов и отзыв от 10 до 2000 символов.');
    await ensureSeed();
    const db = rawDb();
    if (!await reviewTargetExists(db, parsed.data.productId)) return errorResponse('Изделие не найдено.', 404);
    const result = await saveProductReview(db, parsed.data);
    return response({review: result.review}, result.created ? 201 : 200);
  } catch (error) {
    if (error instanceof ReviewConflict) return errorResponse('Этот запрос уже использован. Обновите страницу перед новым отзывом.', 409);
    if (error instanceof ReviewDuplicate) return errorResponse('Такой отзыв уже отправлен. Подождите минуту перед повторной отправкой.', 429);
    return errorResponse('Не удалось сохранить отзыв. Текст остался в форме — попробуйте ещё раз.', 503);
  }
}
