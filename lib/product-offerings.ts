/** Display-only uses of existing catalog items; this does not add stock or prices. */
export const productOfferings = [
  {
    id: 'shelf',
    title: 'Полка',
    description: 'Для книг, любимых вещей и небольших коллекций. Полированная сосна Кело с естественным живым краем.',
    image: '/images/quiet-shelf.webp',
    alt: 'Тонкая полка из сосны Кело с природным краем на тёмной стене — пример изделия',
    productId: 'PL-001',
    reviewId: 'PL-001',
    href: '/constructor?board=PL-001',
  },
  {
    id: 'windowsill',
    title: 'Подоконник',
    description: 'Тёплая деревянная поверхность у окна. Ровный задний спил для примыкания и природный край со стороны комнаты.',
    image: '/images/gallery/project-window.webp',
    alt: 'Подоконник из плоской доски Кело у большого окна — пример изделия',
    productId: 'PD-001',
    reviewId: 'PD-001',
    href: '/constructor?board=PD-001',
  },
  {
    id: 'kitchen-shelf',
    title: 'Полка для кухни',
    description: 'Открытая полка для чашек, посуды и повседневных мелочей. Натуральная фактура дерева в кухонном пространстве.',
    image: '/images/shelf.webp',
    alt: 'Полированная полка Кело с чашками и естественным краем — пример использования на кухне',
    productId: 'PL-001',
    reviewId: 'kitchen-shelf',
    href: '/constructor?board=PL-001',
  },
] as const;
