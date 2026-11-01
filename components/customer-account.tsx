'use client';
import {SiteText} from '@/components/site-content';
import {useCallback, useEffect, useRef, useState, type FormEvent} from 'react';
import {UserRound, LogOut, ShieldCheck} from 'lucide-react';
import {safeAccountReturnPath, type CustomerProfile} from '@/lib/customer-auth';

export function useCustomerAccount() {
  const [user, setUser] = useState<CustomerProfile | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);
  const reload = useCallback(async () => {
    controller.current?.abort(); const abort = new AbortController(); controller.current = abort;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/account', {cache: 'no-store', signal: abort.signal});
      const result = await response.json() as {user: CustomerProfile | null; error?: string};
      if (!response.ok) throw new Error(result.error || 'Не удалось проверить вход.');
      if (abort.signal.aborted) return;
      setUser(result.user);
    } catch (error) {if (!abort.signal.aborted) setError(error instanceof Error ? error.message : 'Не удалось проверить вход.');}
    finally {if (!abort.signal.aborted) setLoading(false);}
  }, []);
  useEffect(() => {void reload(); window.addEventListener('kelo-customer-updated', reload); return () => {controller.current?.abort(); window.removeEventListener('kelo-customer-updated', reload);};}, [reload]);
  return {user, loading, error, reload};
}

export function CustomerAccountPage() {
  const {user, loading, error: sessionError, reload} = useCustomerAccount();
  const [mode, setMode] = useState<'login' | 'register'>('login'), [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirmation, setConfirmation] = useState('');
  const [next, setNext] = useState('/products'), [busy, setBusy] = useState(false), [error, setError] = useState(''), [success, setSuccess] = useState('');
  useEffect(() => {const query = new URLSearchParams(window.location.search); setNext(safeAccountReturnPath(query.get('next'))); if (query.get('mode') === 'register') setMode('register');}, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setError(''); setSuccess('');
    if (mode === 'register' && password !== confirmation) {setError('Пароли не совпадают. Проверьте повторный ввод.'); return;}
    setBusy(true);
    try {
      const response = await fetch(`/api/account/${mode}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(mode === 'register' ? {name, email, password} : {email, password})});
      const result = await response.json() as {user?: CustomerProfile; error?: string};
      if (!response.ok || !result.user) throw new Error(result.error || 'Не удалось войти.');
      setPassword(''); setConfirmation('');
      setSuccess(mode === 'register' ? 'Аккаунт создан. Теперь можно оставить отзыв.' : 'Вы вошли в аккаунт.');
      window.dispatchEvent(new Event('kelo-customer-updated'));
      await reload();
    } catch (error) {setError(error instanceof Error ? error.message : 'Не удалось войти. Попробуйте ещё раз.');}
    finally {setBusy(false);}
  }
  async function logout() {
    setBusy(true); setError(''); setSuccess('');
    try {
      const response = await fetch('/api/account/logout', {method: 'POST'});
      if (!response.ok) throw new Error('Не удалось выйти. Попробуйте ещё раз.');
      setPassword(''); setConfirmation('');
      window.dispatchEvent(new Event('kelo-customer-updated')); await reload();
    } catch (error) {setError(error instanceof Error ? error.message : 'Не удалось выйти.');}
    finally {setBusy(false);}
  }
  return <main id="main" className="container customer-account-page">
    <div className="customer-account-intro"><p className="eyebrow">KELO WOOD MARKET</p><h1><SiteText text={"Ваше место"}/><br/><SiteText text={"в истории Кело."}/></h1><p><SiteText text={"Войдите, чтобы поделиться впечатлением об изделии. Для оформления заказа регистрация не нужна."}/></p><div className="customer-account-assurance"><ShieldCheck size={22} aria-hidden="true"/><span>Пароль хранится в виде защищённого хеша. Имя будет видно рядом с вашим отзывом.</span></div></div>
    <section className="customer-account-card" aria-label="Аккаунт покупателя">
      {loading ? <p role="status">Проверяем вход…</p> : sessionError ? <><p className="form-error" role="alert">{sessionError}</p><button className="btn" type="button" onClick={() => void reload()}>Повторить</button></> : user ? <>
        <div className="customer-account-avatar"><UserRound size={28} aria-hidden="true"/></div><p className="eyebrow">ВЫ ВОШЛИ</p><h2>{user.name}</h2><p className="customer-account-email">{user.email}</p><p>Отзывы публикуются под вашим именем. Email не отображается посетителям.</p>
        <p className="customer-account-success" role="status">{success}</p><a className="btn full" href={next}>Вернуться к изделию</a><button className="customer-logout" type="button" disabled={busy} onClick={() => void logout()}><LogOut size={17} aria-hidden="true"/>{busy ? 'Выходим…' : 'Выйти из аккаунта'}</button>
      </> : <>
        <div className="customer-account-switch" role="group" aria-label="Способ входа"><button type="button" aria-pressed={mode === 'login'} onClick={() => {setMode('login'); setError(''); setPassword(''); setConfirmation('');}}>Вход</button><button type="button" aria-pressed={mode === 'register'} onClick={() => {setMode('register'); setError(''); setPassword(''); setConfirmation('');}}>Регистрация</button></div>
        <h2>{mode === 'register' ? 'Познакомимся?' : 'С возвращением.'}</h2><p>{mode === 'register' ? 'Создайте аккаунт для настоящих отзывов о наших изделиях.' : 'Введите email и пароль своего аккаунта.'}</p>
        <form onSubmit={submit} aria-busy={busy}>
          {mode === 'register' && <label>Ваше имя<input name="name" autoComplete="name" minLength={2} maxLength={60} value={name} onChange={event => setName(event.target.value)} required disabled={busy}/><small>От 2 до 60 символов. Имя появится рядом с отзывом.</small></label>}
          <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} required disabled={busy}/></label>
          <label>Пароль<input name="password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 10 : 1} maxLength={200} value={password} onChange={event => setPassword(event.target.value)} required disabled={busy} aria-describedby={error ? 'customer-account-form-error' : undefined}/>{mode === 'register' && <small>От 10 до 200 символов. Можно использовать длинную парольную фразу.</small>}</label>
          {mode === 'register' && <label>Повторите пароль<input name="password-confirmation" type="password" autoComplete="new-password" minLength={10} maxLength={200} value={confirmation} onChange={event => setConfirmation(event.target.value)} required disabled={busy} aria-invalid={!!confirmation && confirmation !== password} aria-describedby={error ? 'customer-account-form-error' : undefined}/></label>}
          {error && <p id="customer-account-form-error" className="form-error" role="alert">{error}</p>}
          <button className="btn full" disabled={busy}>{busy ? 'Подождите…' : mode === 'register' ? 'Создать аккаунт' : 'Войти'}</button>
        </form><p className="customer-account-guest">Заказ можно оформить без аккаунта: контакты и адрес указываются при оформлении.</p>
      </>}
      {user && error && <p className="form-error" role="alert">{error}</p>}
      <a className="customer-back-link" href="/products">Продолжить выбирать изделия</a>
    </section>
  </main>;
}
