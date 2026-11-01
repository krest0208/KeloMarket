export const WILDBERRIES_URL = 'https://www.wildberries.ru/catalog/1932827276/detail.aspx';

export interface SiteNavigationItem {
  href: string;
  label: string;
  mobileLabel?: string;
  external?: boolean;
  activePaths?: readonly string[];
}

/** Shared by the header's desktop and mobile menus. */
export const PRIMARY_NAVIGATION: readonly SiteNavigationItem[] = [
  {href: '/#board', label: 'Доска Кело', activePaths: ['/catalog']},
  {href: '/products', label: 'Изделия', activePaths: ['/products']},
  {href: '/constructor', label: 'Редактор', mobileLabel: 'Редактор доски', activePaths: ['/constructor']},
  {href: '/#about', label: 'О Кело', mobileLabel: 'О древесине Кело'},
  {href: '/#delivery', label: 'Доставка', mobileLabel: 'Доставка и оплата'},
  {href: WILDBERRIES_URL, label: 'Мы на WB', external: true},
];
