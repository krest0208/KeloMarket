'use client';
import {SiteText} from '@/components/site-content';


import {useCallback, useEffect, useId, useRef, useState, type FormEvent} from 'react';
import type {ProductReview, ReviewPage} from '@/lib/reviews';

interface ProductReviewsProps {productId: string; title: string; compact?: boolean}
const formatDate = (value: string) => new Intl.DateTimeFormat('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(value));

export function ProductReviews({productId, title, compact = false}: ProductReviewsProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [total, setTotal] = useState(0), [offset, setOffset] = useState(0), [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false), [loading, setLoading] = useState(true), [loadError, setLoadError] = useState('');
  const [name, setName] = useState(''), [text, setText] = useState('');
  const [nameError, setNameError] = useState(''), [textError, setTextError] = useState('');
  const [busy, setBusy] = useState(false), [submitError, setSubmitError] = useState(''), [success, setSuccess] = useState('');
  const controller = useRef<AbortController | null>(null), posting = useRef(false), requestId = useRef<string | null>(null);
  const currentProduct = useRef(productId);
  currentProduct.current = productId;

  const load = useCallback(async (start = 0, append = false) => {
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    setLoading(true); setLoadError('');
    try {
      const response = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}&offset=${start}`, {cache: 'no-store', signal: abort.signal});
      const data = await response.json() as ReviewPage & {error?: string};
      if (!response.ok) throw new Error(data.error || 'Не удалось загрузить отзывы.');
      if (abort.signal.aborted) return;
      setReviews(previous => append ? [...previous, ...data.reviews.filter(review => !previous.some(existing => existing.id === review.id))] : data.reviews);
      setTotal(data.total); setOffset(start + data.reviews.length); setHasMore(data.hasMore); setLoaded(true);
    } catch (error) {
      if (!abort.signal.aborted) setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить отзывы.');
    } finally {
      if (!abort.signal.aborted) setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    setReviews([]); setTotal(0); setOffset(0); setHasMore(false); setLoaded(false);
    setName(''); setText(''); setNameError(''); setTextError(''); setSubmitError(''); setSuccess(''); requestId.current = null;
    void load();
    return () => controller.current?.abort();
  }, [load]);

  const validateName = () => {
    const message = name.trim().length < 2 ? 'Укажите имя: не меньше 2 символов.' : '';
    setNameError(message); return !message;
  };
  const validateText = () => {
    const message = text.trim().length < 10 ? 'Напишите хотя бы 10 символов.' : '';
    setTextError(message); return !message;
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validName = validateName(), validText = validateText();
    if (!validName || !validText || posting.current) return;
    posting.current = true; setBusy(true); setSubmitError(''); setSuccess('');
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/reviews', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({requestId: requestId.current, productId, name: name.trim(), text: text.trim()})});
      const data = await response.json() as {review?: ProductReview; error?: string};
      if (!response.ok || !data.review) throw new Error(data.error || 'Не удалось сохранить отзыв.');
      if (currentProduct.current !== productId) return;
      // Show the actual server-saved record immediately, including if a later
      // refresh fails. Never insert a sample review or a made-up counter.
      const review = data.review;
      setReviews(previous => previous.some(item => item.id === review.id) ? previous : [review, ...previous]);
      setLoaded(true); setText(''); setTextError(''); requestId.current = null;
      setSuccess('Спасибо! Ваш отзыв опубликован.');
      await load();
    } catch (error) {
      if (currentProduct.current === productId) setSubmitError(error instanceof Error ? error.message : 'Не удалось сохранить отзыв. Текст остался в форме.');
    } finally {
      posting.current = false;
      if (currentProduct.current === productId) setBusy(false);
    }
  }

  return <section className={'product-reviews' + (compact ? ' product-reviews-compact' : '')} aria-labelledby={`reviews-title-${uid}`}>
    <div className="product-reviews-heading">
      <h3 id={`reviews-title-${uid}`}><SiteText text={"Отзывы об изделии"}/> <span>«{<SiteText text={title}/>}»</span></h3>
      {loaded && !loadError && <span className="product-reviews-total">{total} {total % 10 === 1 && total % 100 !== 11 ? 'отзыв' : total % 10 >= 2 && total % 10 <= 4 && (total % 100 < 12 || total % 100 > 14) ? 'отзыва' : 'отзывов'}</span>}
    </div>
    <div className="product-reviews-content" aria-busy={loading}>
      {loading && !loaded && <p className="product-reviews-note" role="status"><SiteText text={"Загружаем отзывы…"}/></p>}
      {loadError && <div className="product-reviews-load-error"><p role="alert">{loadError}</p><button className="product-reviews-retry" type="button" disabled={loading} onClick={() => void load()}><SiteText text={"Попробовать ещё раз"}/></button></div>}
      {loaded && !loading && !loadError && reviews.length === 0 && <p className="product-reviews-empty"><SiteText text={"Пока нет отзывов. Поделитесь первым впечатлением об этом изделии."}/></p>}
      {reviews.length > 0 && <ul className="product-reviews-list">{reviews.map(review => <li key={review.id}>
        <article><div className="product-review-meta"><strong>{review.name}</strong><time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time></div><p>{review.text}</p></article>
      </li>)}</ul>}
      {hasMore && <button className="product-reviews-more" type="button" disabled={loading} onClick={() => void load(offset, true)}>{loading ? 'Загружаем…' : 'Показать ещё'}</button>}
    </div>
    <form className="product-review-form" onSubmit={submit} aria-label={`Написать отзыв: ${title}`} aria-busy={busy}>
      <h4><SiteText text={"Написать отзыв"}/></h4>
      <label htmlFor={`review-name-${uid}`}><SiteText text={"Ваше имя"}/></label>
      <input id={`review-name-${uid}`} name="review-name" autoComplete="name" required minLength={2} maxLength={60} value={name} disabled={busy} aria-invalid={!!nameError} aria-describedby={nameError ? `review-name-error-${uid}` : undefined} onBlur={validateName} onChange={event => {setName(event.target.value); setNameError(''); setSuccess(''); requestId.current = null;}}/>
      {nameError && <p id={`review-name-error-${uid}`} className="product-review-field-error">{nameError}</p>}
      <label htmlFor={`review-text-${uid}`}><SiteText text={"Ваш отзыв"}/></label>
      <textarea id={`review-text-${uid}`} name="review-text" required rows={4} minLength={10} maxLength={2000} value={text} disabled={busy} aria-invalid={!!textError} aria-describedby={`review-text-help-${uid}${textError ? ` review-text-error-${uid}` : ''}`} onBlur={validateText} onChange={event => {setText(event.target.value); setTextError(''); setSuccess(''); requestId.current = null;}}/>
      <div id={`review-text-help-${uid}`} className="product-review-text-help"><span><SiteText text={"От 10 до 2000 символов"}/></span><span>{text.length} / 2000</span></div>
      {textError && <p id={`review-text-error-${uid}`} className="product-review-field-error">{textError}</p>}
      <p className="product-review-privacy"><SiteText text={"Имя и текст отзыва будут видны посетителям сайта. Не указывайте телефон и другие личные данные."}/></p>
      {submitError && <p className="product-review-submit-error" role="alert">{submitError}</p>}
      <p className="product-review-success" role="status" aria-live="polite">{success}</p>
      <button className="btn product-review-submit" type="submit" disabled={busy}>{busy ? 'Публикуем…' : 'Опубликовать отзыв'}</button>
    </form>
  </section>;
}
