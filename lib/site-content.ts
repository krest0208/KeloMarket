export interface SiteContentField {key:string;label:string;defaultValue:string;multiline?:boolean}
function hashContentText(text:string){let hash=2166136261;for(const c of text){hash^=c.codePointAt(0)!;hash=Math.imul(hash,16777619);}return 'copy_'+(hash>>>0).toString(36);}
export const SITE_CONTENT_FIELDS:SiteContentField[]=[
  {
    "key": "copy_hx5vti",
    "label": "StoreProvider · В корзину",
    "defaultValue": "В корзину",
    "multiline": false
  },
  {
    "key": "copy_12m4anm",
    "label": "Меню · Сосна Кело.",
    "defaultValue": "Сосна Кело.",
    "multiline": false
  },
  {
    "key": "copy_64yoc5",
    "label": "Меню · Особенности",
    "defaultValue": "Особенности",
    "multiline": false
  },
  {
    "key": "copy_1chngxt",
    "label": "Меню · О доске",
    "defaultValue": "О доске",
    "multiline": false
  },
  {
    "key": "copy_1c3ignf",
    "label": "Меню · В ваш размер",
    "defaultValue": "В ваш размер",
    "multiline": false
  },
  {
    "key": "copy_18gnf4p",
    "label": "Меню · Заказать",
    "defaultValue": "Заказать",
    "multiline": false
  },
  {
    "key": "copy_15o1if9",
    "label": "PhotoGallery · . Фото",
    "defaultValue": ". Фото",
    "multiline": false
  },
  {
    "key": "copy_ztq5hs",
    "label": "PhotoGallery · из",
    "defaultValue": "из",
    "multiline": false
  },
  {
    "key": "copy_4zbuc2",
    "label": "PhotoGallery · Листайте колесом мыши или свайпом по фото",
    "defaultValue": "Листайте колесом мыши или свайпом по фото",
    "multiline": false
  },
  {
    "key": "copy_65wv4q",
    "label": "PhotoGallery · Предыдущее",
    "defaultValue": "Предыдущее",
    "multiline": false
  },
  {
    "key": "copy_11ed132",
    "label": "PhotoGallery · Следующее",
    "defaultValue": "Следующее",
    "multiline": false
  },
  {
    "key": "copy_9ly0x8",
    "label": "PhotoGallery · Визуализация для знакомства с материалом. Реальная форма и рисунок кон",
    "defaultValue": "Визуализация для знакомства с материалом. Реальная форма и рисунок конкретной доски отличаются.",
    "multiline": true
  },
  {
    "key": "copy_mfzsyu",
    "label": "Детали древесины · Фактура",
    "defaultValue": "Фактура",
    "multiline": false
  },
  {
    "key": "copy_rrsthg",
    "label": "Детали древесины · Рисунок, который",
    "defaultValue": "Рисунок, который",
    "multiline": false
  },
  {
    "key": "copy_9z85pm",
    "label": "Детали древесины · невозможно повторить.",
    "defaultValue": "невозможно повторить.",
    "multiline": false
  },
  {
    "key": "copy_1jjm46u",
    "label": "Детали древесины · Сучки, трещины и серебристая текстура. Всё, за что мы любим Кело.",
    "defaultValue": "Сучки, трещины и серебристая текстура. Всё, за что мы любим Кело.",
    "multiline": false
  },
  {
    "key": "copy_zg2nvz",
    "label": "Детали древесины · Живой край",
    "defaultValue": "Живой край",
    "multiline": false
  },
  {
    "key": "copy_1ty1k1j",
    "label": "Детали древесины · Природа задала форму.",
    "defaultValue": "Природа задала форму.",
    "multiline": false
  },
  {
    "key": "copy_pe7lik",
    "label": "Детали древесины · Мы её сохранили.",
    "defaultValue": "Мы её сохранили.",
    "multiline": false
  },
  {
    "key": "copy_nhh486",
    "label": "Детали древесины · Неровный край остаётся частью изделия. Длину и обработку выбираете вы.",
    "defaultValue": "Неровный край остаётся частью изделия. Длину и обработку выбираете вы.",
    "multiline": false
  },
  {
    "key": "copy_sa6bpz",
    "label": "Детали древесины · В интерьере",
    "defaultValue": "В интерьере",
    "multiline": false
  },
  {
    "key": "copy_x6vttn",
    "label": "Детали древесины · Маленькая деталь.",
    "defaultValue": "Маленькая деталь.",
    "multiline": false
  },
  {
    "key": "copy_4rafe",
    "label": "Детали древесины · Другое ощущение дома.",
    "defaultValue": "Другое ощущение дома.",
    "multiline": false
  },
  {
    "key": "copy_1ajcy4o",
    "label": "Детали древесины · Полка из массива — место для любимых вещей и природный акцент в интерь",
    "defaultValue": "Полка из массива — место для любимых вещей и природный акцент в интерьере.",
    "multiline": false
  },
  {
    "key": "copy_losnn0",
    "label": "Детали древесины · Ближе к природе",
    "defaultValue": "Ближе к природе",
    "multiline": false
  },
  {
    "key": "copy_1mj5wwp",
    "label": "Детали древесины · Характер. В деталях.",
    "defaultValue": "Характер. В деталях.",
    "multiline": false
  },
  {
    "key": "copy_rdtc3t",
    "label": "Детали древесины · Демонстрационные изображения. Рисунок каждой реальной доски уникален.",
    "defaultValue": "Демонстрационные изображения. Рисунок каждой реальной доски уникален.",
    "multiline": false
  },
  {
    "key": "copy_1etsu3u",
    "label": "Главная · Слэбы Кело.",
    "defaultValue": "Слэбы Кело.",
    "multiline": false
  },
  {
    "key": "copy_rfeym2",
    "label": "Главная · Натуральное дерево",
    "defaultValue": "Натуральное дерево",
    "multiline": false
  },
  {
    "key": "copy_1ljpwao",
    "label": "Главная · с характером.",
    "defaultValue": "с характером.",
    "multiline": false
  },
  {
    "key": "copy_70rym6",
    "label": "Главная · Уникальные слэбы карельской сосны Кело.",
    "defaultValue": "Уникальные слэбы карельской сосны Кело.",
    "multiline": false
  },
  {
    "key": "copy_2pi2p1",
    "label": "Главная · Природная красота. В вашем размере.",
    "defaultValue": "Природная красота. В вашем размере.",
    "multiline": false
  },
  {
    "key": "copy_3tplq1",
    "label": "Главная · От",
    "defaultValue": "От",
    "multiline": false
  },
  {
    "key": "copy_47l3ba",
    "label": "Главная · / пог. м",
    "defaultValue": "/ пог. м",
    "multiline": false
  },
  {
    "key": "copy_1arzibf",
    "label": "Главная · Демо-цена",
    "defaultValue": "Демо-цена",
    "multiline": false
  },
  {
    "key": "copy_1p3spyr",
    "label": "Главная · Карельская сухостойная сосна",
    "defaultValue": "Карельская сухостойная сосна",
    "multiline": false
  },
  {
    "key": "copy_nyouou",
    "label": "Главная · У дерева есть характер.",
    "defaultValue": "У дерева есть характер.",
    "multiline": false
  },
  {
    "key": "copy_10rwfkl",
    "label": "Главная · Мы его сохраняем.",
    "defaultValue": "Мы его сохраняем.",
    "multiline": false
  },
  {
    "key": "copy_1mutag8",
    "label": "Главная · Кело — северная сосна, высохшая естественным образом. Её фактура, сучк",
    "defaultValue": "Кело — северная сосна, высохшая естественным образом. Её фактура, сучки и трещины становятся частью вашего интерьера. Мы бережно готовим материал к новой истории.",
    "multiline": true
  },
  {
    "key": "copy_prflg3",
    "label": "Главная · Живой край.",
    "defaultValue": "Живой край.",
    "multiline": false
  },
  {
    "key": "copy_jar6d3",
    "label": "Главная · Природный силуэт вместо одинаковых линий.",
    "defaultValue": "Природный силуэт вместо одинаковых линий.",
    "multiline": false
  },
  {
    "key": "copy_1udgyhh",
    "label": "Главная · 30 или 40 мм.",
    "defaultValue": "30 или 40 мм.",
    "multiline": false
  },
  {
    "key": "copy_9rmut8",
    "label": "Главная · Две толщины для разных идей и задач.",
    "defaultValue": "Две толщины для разных идей и задач.",
    "multiline": false
  },
  {
    "key": "copy_1np1nt0",
    "label": "Главная · До 6 метров.",
    "defaultValue": "До 6 метров.",
    "multiline": false
  },
  {
    "key": "copy_1spcs27",
    "label": "Главная · Исходные доски на складе. Для заказа выберите длину до 150 см.",
    "defaultValue": "Исходные доски на складе. Для заказа выберите длину до 150 см.",
    "multiline": false
  },
  {
    "key": "copy_6w53vv",
    "label": "Главная · Родом с севера",
    "defaultValue": "Родом с севера",
    "multiline": false
  },
  {
    "key": "copy_smp3v1",
    "label": "Главная · Спокойствие леса.",
    "defaultValue": "Спокойствие леса.",
    "multiline": false
  },
  {
    "key": "copy_11cyeci",
    "label": "Главная · Тепло настоящего дерева.",
    "defaultValue": "Тепло настоящего дерева.",
    "multiline": false
  },
  {
    "key": "copy_gg46b3",
    "label": "Главная · Карелия — наше вдохновение. Натуральная древесина — материал, с которы",
    "defaultValue": "Карелия — наше вдохновение. Натуральная древесина — материал, с которым хочется жить.",
    "multiline": false
  },
  {
    "key": "copy_19pul5o",
    "label": "Главная · Идеи для вашего дома",
    "defaultValue": "Идеи для вашего дома",
    "multiline": false
  },
  {
    "key": "copy_1uuuj2r",
    "label": "Главная · Что можно создать",
    "defaultValue": "Что можно создать",
    "multiline": false
  },
  {
    "key": "copy_19lyswa",
    "label": "Главная · из Кело.",
    "defaultValue": "из Кело.",
    "multiline": false
  },
  {
    "key": "copy_2is5x7",
    "label": "Главная · Примеры для вдохновения. Мы предлагаем древесину и заготовки; опоры и ",
    "defaultValue": "Примеры для вдохновения. Мы предлагаем древесину и заготовки; опоры и крепёж подбираются отдельно.",
    "multiline": true
  },
  {
    "key": "copy_1rat6uz",
    "label": "Главная · От выбора до дома",
    "defaultValue": "От выбора до дома",
    "multiline": false
  },
  {
    "key": "copy_1mjt4tl",
    "label": "Главная · Всё начинается с доски.",
    "defaultValue": "Всё начинается с доски.",
    "multiline": false
  },
  {
    "key": "copy_dp76rh",
    "label": "Главная · Познакомьтесь с Кело",
    "defaultValue": "Познакомьтесь с Кело",
    "multiline": false
  },
  {
    "key": "copy_5zp9wd",
    "label": "Главная · Рассмотрите фактуру и живой край доски.",
    "defaultValue": "Рассмотрите фактуру и живой край доски.",
    "multiline": false
  },
  {
    "key": "copy_1f4n3zz",
    "label": "Главная · Задайте параметры",
    "defaultValue": "Задайте параметры",
    "multiline": false
  },
  {
    "key": "copy_qp1zzg",
    "label": "Главная · Настройте длину и обработку. Цена появится сразу.",
    "defaultValue": "Настройте длину и обработку. Цена появится сразу.",
    "multiline": false
  },
  {
    "key": "copy_190y03i",
    "label": "Главная · Оформите заказ",
    "defaultValue": "Оформите заказ",
    "multiline": false
  },
  {
    "key": "copy_1l3q00f",
    "label": "Главная · Укажите контакты и выберите доставку.",
    "defaultValue": "Укажите контакты и выберите доставку.",
    "multiline": false
  },
  {
    "key": "copy_eumyy7",
    "label": "Главная · Создайте своё",
    "defaultValue": "Создайте своё",
    "multiline": false
  },
  {
    "key": "copy_1c1qzw",
    "label": "Главная · Мы подготовим и бережно упакуем изделие.",
    "defaultValue": "Мы подготовим и бережно упакуем изделие.",
    "multiline": false
  },
  {
    "key": "copy_wagnz6",
    "label": "Главная · Доставка и оплата",
    "defaultValue": "Доставка и оплата",
    "multiline": false
  },
  {
    "key": "copy_18h8ihg",
    "label": "Главная · Продумано.",
    "defaultValue": "Продумано.",
    "multiline": false
  },
  {
    "key": "copy_1o76xu7",
    "label": "Главная · До вашего порога.",
    "defaultValue": "До вашего порога.",
    "multiline": false
  },
  {
    "key": "copy_knnhe3",
    "label": "Главная · Размер и обработка — в конструкторе.",
    "defaultValue": "Размер и обработка — в конструкторе.",
    "multiline": false
  },
  {
    "key": "copy_h1pg1q",
    "label": "Главная · Доставка — с учётом вашего изделия.",
    "defaultValue": "Доставка — с учётом вашего изделия.",
    "multiline": false
  },
  {
    "key": "copy_tp7574",
    "label": "Главная · Рассчитать изделие",
    "defaultValue": "Рассчитать изделие",
    "multiline": false
  },
  {
    "key": "copy_xhgtmz",
    "label": "Главная · Доставка по России",
    "defaultValue": "Доставка по России",
    "multiline": false
  },
  {
    "key": "copy_1835bx1",
    "label": "Главная · Способ и сроки согласуем перед отправкой. Для изделий до 250 см в офор",
    "defaultValue": "Способ и сроки согласуем перед отправкой. Для изделий до 250 см в оформлении показан пример расчёта. Яндекс Доставка пока не подключена.",
    "multiline": true
  },
  {
    "key": "copy_18c1jr1",
    "label": "Главная · Длинные доски",
    "defaultValue": "Длинные доски",
    "multiline": false
  },
  {
    "key": "copy_189x45f",
    "label": "Главная · Для изделий длиннее 250 см доставку рассчитаем индивидуально. До согла",
    "defaultValue": "Для изделий длиннее 250 см доставку рассчитаем индивидуально. До согласования она не включается в итоговую сумму.",
    "multiline": true
  },
  {
    "key": "copy_4djqaj",
    "label": "Главная · Оплата заказа",
    "defaultValue": "Оплата заказа",
    "multiline": false
  },
  {
    "key": "copy_1z0mltd",
    "label": "Главная · ЮKassa пока не подключена. Оформление и онлайн-оплата работают в демон",
    "defaultValue": "ЮKassa пока не подключена. Оформление и онлайн-оплата работают в демонстрационном режиме: деньги не списываются, данные карты не запрашиваются.",
    "multiline": true
  },
  {
    "key": "copy_1trl046",
    "label": "Главная · Самовывоз",
    "defaultValue": "Самовывоз",
    "multiline": false
  },
  {
    "key": "copy_gr6lc",
    "label": "Главная · Без стоимости доставки. Адрес склада и сроки подготовки уточняются при",
    "defaultValue": "Без стоимости доставки. Адрес склада и сроки подготовки уточняются при согласовании заказа.",
    "multiline": true
  },
  {
    "key": "copy_1hvu3qz",
    "label": "Главная · Природа создала.",
    "defaultValue": "Природа создала.",
    "multiline": false
  },
  {
    "key": "copy_uxuszn",
    "label": "Главная · Продолжите вы.",
    "defaultValue": "Продолжите вы.",
    "multiline": false
  },
  {
    "key": "copy_zxio0f",
    "label": "Главная · Натуральная доска Кело для интерьера с характером.",
    "defaultValue": "Натуральная доска Кело для интерьера с характером.",
    "multiline": false
  },
  {
    "key": "copy_6blwi7",
    "label": "Главная · Задайте свой размер — и начните новую историю.",
    "defaultValue": "Задайте свой размер — и начните новую историю.",
    "multiline": false
  },
  {
    "key": "copy_fjsiyo",
    "label": "Доска Кело · Природа. В вашем размере.",
    "defaultValue": "Природа. В вашем размере.",
    "multiline": false
  },
  {
    "key": "copy_aajv02",
    "label": "Доска Кело · Доска Кело.",
    "defaultValue": "Доска Кело.",
    "multiline": false
  },
  {
    "key": "copy_koxaf3",
    "label": "Доска Кело · Карельская сухостойная сосна с живым краем, серебристой фактурой и неп",
    "defaultValue": "Карельская сухостойная сосна с живым краем, серебристой фактурой и неповторимым рисунком. Сохраним её характер и подготовим под вашу идею.",
    "multiline": true
  },
  {
    "key": "copy_1w7sl39",
    "label": "Доска Кело · Длина",
    "defaultValue": "Длина",
    "multiline": false
  },
  {
    "key": "copy_1ie7h3k",
    "label": "Доска Кело · 30–150 см",
    "defaultValue": "30–150 см",
    "multiline": false
  },
  {
    "key": "copy_1eaprwg",
    "label": "Доска Кело · Ширина",
    "defaultValue": "Ширина",
    "multiline": false
  },
  {
    "key": "copy_hbfev5",
    "label": "Доска Кело · до 400 мм",
    "defaultValue": "до 400 мм",
    "multiline": false
  },
  {
    "key": "copy_1xz5avu",
    "label": "Доска Кело · Толщина",
    "defaultValue": "Толщина",
    "multiline": false
  },
  {
    "key": "copy_1rl94u3",
    "label": "Доска Кело · 30 / 40 мм",
    "defaultValue": "30 / 40 мм",
    "multiline": false
  },
  {
    "key": "copy_dvsit8",
    "label": "Доска Кело · Размеры, обработку и количество выберете в редакторе.",
    "defaultValue": "Размеры, обработку и количество выберете в редакторе.",
    "multiline": false
  },
  {
    "key": "copy_rwm8v9",
    "label": "Доска Кело · Изображение — пример материала. Стоимость рассчитывается в редакторе.",
    "defaultValue": "Изображение — пример материала. Стоимость рассчитывается в редакторе.",
    "multiline": false
  },
  {
    "key": "copy_10n5kjs",
    "label": "Карточка товара · В наличии · демо",
    "defaultValue": "В наличии · демо",
    "multiline": false
  },
  {
    "key": "copy_1arapwa",
    "label": "Карточка товара · КАРЕЛЬСКАЯ СОСНА",
    "defaultValue": "КАРЕЛЬСКАЯ СОСНА",
    "multiline": false
  },
  {
    "key": "copy_2obrif",
    "label": "Карточка товара · До",
    "defaultValue": "До",
    "multiline": false
  },
  {
    "key": "copy_10vyvo0",
    "label": "Карточка товара · см",
    "defaultValue": "см",
    "multiline": false
  },
  {
    "key": "copy_12v6yit",
    "label": "Карточка товара · мм",
    "defaultValue": "мм",
    "multiline": false
  },
  {
    "key": "copy_lnmfa1",
    "label": "Карточка товара · от",
    "defaultValue": "от",
    "multiline": false
  },
  {
    "key": "copy_jnrp42",
    "label": "Подвал · НАТУРАЛЬНО. НЕПОВТОРИМО. КЕЛО.",
    "defaultValue": "НАТУРАЛЬНО. НЕПОВТОРИМО. КЕЛО.",
    "multiline": false
  },
  {
    "key": "copy_98b208",
    "label": "Подвал · Доска Кело",
    "defaultValue": "Доска Кело",
    "multiline": false
  },
  {
    "key": "copy_625nlg",
    "label": "Подвал · Фактура и живой край",
    "defaultValue": "Фактура и живой край",
    "multiline": false
  },
  {
    "key": "copy_y7zqii",
    "label": "Подвал · О материале",
    "defaultValue": "О материале",
    "multiline": false
  },
  {
    "key": "copy_rhbsmc",
    "label": "Подвал · Идеи для дома",
    "defaultValue": "Идеи для дома",
    "multiline": false
  },
  {
    "key": "copy_ktgh4d",
    "label": "Подвал · Покупателям",
    "defaultValue": "Покупателям",
    "multiline": false
  },
  {
    "key": "copy_1x8nrtx",
    "label": "Подвал · Изделия",
    "defaultValue": "Изделия",
    "multiline": false
  },
  {
    "key": "copy_vzmr50",
    "label": "Подвал · Конструктор в размер",
    "defaultValue": "Конструктор в размер",
    "multiline": false
  },
  {
    "key": "copy_itzv40",
    "label": "Подвал · О древесине Кело",
    "defaultValue": "О древесине Кело",
    "multiline": false
  },
  {
    "key": "copy_fos5xt",
    "label": "Подвал · Корзина",
    "defaultValue": "Корзина",
    "multiline": false
  },
  {
    "key": "copy_1xu6xb0",
    "label": "Подвал · Ваша история с Кело",
    "defaultValue": "Ваша история с Кело",
    "multiline": false
  },
  {
    "key": "copy_19lid9r",
    "label": "Подвал · Начните с красивой доски.",
    "defaultValue": "Начните с красивой доски.",
    "multiline": false
  },
  {
    "key": "copy_1lkje1i",
    "label": "Подвал · Остальное создадим вместе.",
    "defaultValue": "Остальное создадим вместе.",
    "multiline": false
  },
  {
    "key": "copy_uzrasv",
    "label": "Подвал · Заказать доску",
    "defaultValue": "Заказать доску",
    "multiline": false
  },
  {
    "key": "copy_1rzhdp6",
    "label": "Подвал · kelowoodmarket.ru · Карелия",
    "defaultValue": "kelowoodmarket.ru · Карелия",
    "multiline": false
  },
  {
    "key": "copy_1b0iklh",
    "label": "Подвал · Обработка данных",
    "defaultValue": "Обработка данных",
    "multiline": false
  },
  {
    "key": "copy_9njzij",
    "label": "Подвал · Панель управления",
    "defaultValue": "Панель управления",
    "multiline": false
  },
  {
    "key": "copy_twqd4n",
    "label": "Подвал · Создано с уважением к природе",
    "defaultValue": "Создано с уважением к природе",
    "multiline": false
  },
  {
    "key": "copy_1ypvfal",
    "label": "Подвал · Обработка данных в демо-версии",
    "defaultValue": "Обработка данных в демо-версии",
    "multiline": false
  },
  {
    "key": "copy_18b7fz4",
    "label": "Подвал · Это закрытая демонстрационная версия магазина. При оформлении сохраняю",
    "defaultValue": "Это закрытая демонстрационная версия магазина. При оформлении сохраняются имя, телефон, электронная почта, адрес, комментарий и состав заказа. Они доступны владельцу сайта в панели управления и используются для проверки работы заказа.",
    "multiline": true
  },
  {
    "key": "copy_1m1m0hv",
    "label": "Подвал · Данные банковской карты не запрашиваются. ЮKassa и Яндекс Доставка не ",
    "defaultValue": "Данные банковской карты не запрашиваются. ЮKassa и Яндекс Доставка не подключены, данные этим сервисам не передаются.",
    "multiline": true
  },
  {
    "key": "copy_1okqu7r",
    "label": "Подвал · Перед запуском продаж владелец должен добавить реквизиты оператора, ко",
    "defaultValue": "Перед запуском продаж владелец должен добавить реквизиты оператора, контакты для запросов об удалении данных, сроки хранения и окончательную политику. Для проверки формы используйте вымышленные контактные данные.",
    "multiline": true
  },
  {
    "key": "copy_19ib64t",
    "label": "Новые изделия · Коллекция Кело",
    "defaultValue": "Коллекция Кело",
    "multiline": false
  },
  {
    "key": "copy_1y97wja",
    "label": "Новые изделия · Новые изделия",
    "defaultValue": "Новые изделия",
    "multiline": false
  },
  {
    "key": "copy_zpk44l",
    "label": "Описание доски · Одна доска.",
    "defaultValue": "Одна доска.",
    "multiline": false
  },
  {
    "key": "copy_17v6xiw",
    "label": "Описание доски · Много возможностей.",
    "defaultValue": "Много возможностей.",
    "multiline": false
  },
  {
    "key": "copy_dr7mk6",
    "label": "Описание доски · Натуральный материал для вашей идеи. Размеры и обработка — в отдельном",
    "defaultValue": "Натуральный материал для вашей идеи. Размеры и обработка — в отдельном редакторе.",
    "multiline": false
  },
  {
    "key": "copy_194tezl",
    "label": "Навигация · Главная",
    "defaultValue": "Главная",
    "multiline": false
  },
  {
    "key": "copy_mebblh",
    "label": "Навигация · Каталог",
    "defaultValue": "Каталог",
    "multiline": false
  },
  {
    "key": "copy_y106t2",
    "label": "Настройки доски · Длина доски",
    "defaultValue": "Длина доски",
    "multiline": false
  },
  {
    "key": "copy_z79v7j",
    "label": "Настройки доски · 30 см",
    "defaultValue": "30 см",
    "multiline": false
  },
  {
    "key": "copy_ub98ur",
    "label": "Настройки доски · Максимум",
    "defaultValue": "Максимум",
    "multiline": false
  },
  {
    "key": "copy_dziowg",
    "label": "Настройки доски · см · шаг 1 см",
    "defaultValue": "см · шаг 1 см",
    "multiline": false
  },
  {
    "key": "copy_4wggah",
    "label": "Настройки доски · Размер изделия",
    "defaultValue": "Размер изделия",
    "multiline": false
  },
  {
    "key": "copy_2r21ph",
    "label": "Настройки доски · см ·",
    "defaultValue": "см ·",
    "multiline": false
  },
  {
    "key": "copy_93nawp",
    "label": "Настройки доски · Толщина доски",
    "defaultValue": "Толщина доски",
    "multiline": false
  },
  {
    "key": "copy_qxbcu7",
    "label": "Настройки доски · Заказать товар",
    "defaultValue": "Заказать товар",
    "multiline": false
  },
  {
    "key": "copy_99m0y3",
    "label": "Настройки доски · мм ширина ·",
    "defaultValue": "мм ширина ·",
    "multiline": false
  },
  {
    "key": "copy_1iwvhd0",
    "label": "Настройки доски · мм толщина",
    "defaultValue": "мм толщина",
    "multiline": false
  },
  {
    "key": "copy_sjechy",
    "label": "Настройки доски · Схема и текстура — примеры. Природная форма и рисунок каждой реальной ",
    "defaultValue": "Схема и текстура — примеры. Природная форма и рисунок каждой реальной доски отличаются.",
    "multiline": true
  },
  {
    "key": "copy_162i2eb",
    "label": "Настройки доски · Выберите товар",
    "defaultValue": "Выберите товар",
    "multiline": false
  },
  {
    "key": "copy_mny7sn",
    "label": "Настройки доски · В этой категории пока нет доступных товаров. Выберите другую категорию",
    "defaultValue": "В этой категории пока нет доступных товаров. Выберите другую категорию.",
    "multiline": false
  },
  {
    "key": "copy_1kysr3j",
    "label": "Настройки доски · Ширина доски",
    "defaultValue": "Ширина доски",
    "multiline": false
  },
  {
    "key": "copy_oty4r7",
    "label": "Настройки доски · Ширина · до 400 мм",
    "defaultValue": "Ширина · до 400 мм",
    "multiline": false
  },
  {
    "key": "copy_1336pz1",
    "label": "Настройки доски · Обработка",
    "defaultValue": "Обработка",
    "multiline": false
  },
  {
    "key": "copy_6b42pe",
    "label": "Настройки доски · Шлифовка",
    "defaultValue": "Шлифовка",
    "multiline": false
  },
  {
    "key": "copy_ewvz84",
    "label": "Настройки доски · Прямой спил одной стороны",
    "defaultValue": "Прямой спил одной стороны",
    "multiline": false
  },
  {
    "key": "copy_f62fxw",
    "label": "Настройки доски · Сторона спила",
    "defaultValue": "Сторона спила",
    "multiline": false
  },
  {
    "key": "copy_jhzmp4",
    "label": "Настройки доски · Левая",
    "defaultValue": "Левая",
    "multiline": false
  },
  {
    "key": "copy_1gkffa1",
    "label": "Настройки доски · Правая",
    "defaultValue": "Правая",
    "multiline": false
  },
  {
    "key": "copy_cvedpq",
    "label": "Настройки доски · Сверление отверстий",
    "defaultValue": "Сверление отверстий",
    "multiline": false
  },
  {
    "key": "copy_ksse8m",
    "label": "Настройки доски · / шт.",
    "defaultValue": "/ шт.",
    "multiline": false
  },
  {
    "key": "copy_u0skd2",
    "label": "Настройки доски · Дополнить заказ",
    "defaultValue": "Дополнить заказ",
    "multiline": false
  },
  {
    "key": "copy_bmfd96",
    "label": "Настройки доски · Менсолодержатели для полки",
    "defaultValue": "Менсолодержатели для полки",
    "multiline": false
  },
  {
    "key": "copy_1vqmlig",
    "label": "Настройки доски · / комплект на изделие",
    "defaultValue": "/ комплект на изделие",
    "multiline": false
  },
  {
    "key": "copy_bi5wfq",
    "label": "Настройки доски · Упаковать в подарочную упаковку",
    "defaultValue": "Упаковать в подарочную упаковку",
    "multiline": false
  },
  {
    "key": "copy_7nicyy",
    "label": "Настройки доски · / изделие",
    "defaultValue": "/ изделие",
    "multiline": false
  },
  {
    "key": "copy_1k1inji",
    "label": "Настройки доски · Стоимость ·",
    "defaultValue": "Стоимость ·",
    "multiline": false
  },
  {
    "key": "copy_mxg0pq",
    "label": "Настройки доски · Демо-цена · без доставки",
    "defaultValue": "Демо-цена · без доставки",
    "multiline": false
  },
  {
    "key": "copy_1kpuzkp",
    "label": "Настройки доски · Из чего складывается цена",
    "defaultValue": "Из чего складывается цена",
    "multiline": false
  },
  {
    "key": "copy_br0zp9",
    "label": "Настройки доски · Материал",
    "defaultValue": "Материал",
    "multiline": false
  },
  {
    "key": "copy_iz81u9",
    "label": "Настройки доски · Прямой спил",
    "defaultValue": "Прямой спил",
    "multiline": false
  },
  {
    "key": "copy_1065y92",
    "label": "Настройки доски · Отверстия",
    "defaultValue": "Отверстия",
    "multiline": false
  },
  {
    "key": "copy_m6eaj3",
    "label": "Настройки доски · Изготовление полки",
    "defaultValue": "Изготовление полки",
    "multiline": false
  },
  {
    "key": "copy_fgtse8",
    "label": "Настройки доски · Менсолодержатели",
    "defaultValue": "Менсолодержатели",
    "multiline": false
  },
  {
    "key": "copy_8p85vb",
    "label": "Настройки доски · Подарочная упаковка",
    "defaultValue": "Подарочная упаковка",
    "multiline": false
  },
  {
    "key": "copy_o5ubre",
    "label": "Редактор · В РАЗМЕР ВАШЕЙ ИДЕИ",
    "defaultValue": "В РАЗМЕР ВАШЕЙ ИДЕИ",
    "multiline": false
  },
  {
    "key": "copy_siyulh",
    "label": "Редактор · Ваш замысел. Ваше дерево.",
    "defaultValue": "Ваш замысел. Ваше дерево.",
    "multiline": false
  },
  {
    "key": "copy_1faqhzj",
    "label": "Редактор · Задайте длину и обработку. Мы сохраним всё, за что вы полюбили эту дос",
    "defaultValue": "Задайте длину и обработку. Мы сохраним всё, за что вы полюбили эту доску.",
    "multiline": false
  },
  {
    "key": "copy_1elfzyu",
    "label": "Редактор · Доска — от 30 до 150 см",
    "defaultValue": "Доска — от 30 до 150 см",
    "multiline": false
  },
  {
    "key": "copy_1vf6fz3",
    "label": "Редактор · Длину задавайте ползунком под изображением, точность — 1 см. При перет",
    "defaultValue": "Длину задавайте ползунком под изображением, точность — 1 см. При перетаскивании на каждых 10 см ползунок ненадолго задерживается. Полки и другие изделия доступны во вкладке «Заказать товар» с размерами из каталога.",
    "multiline": true
  },
  {
    "key": "copy_1upz3k7",
    "label": "Страница товара · В каталог",
    "defaultValue": "В каталог",
    "multiline": false
  },
  {
    "key": "copy_198zzey",
    "label": "Страница товара · Карельская сосна Кело",
    "defaultValue": "Карельская сосна Кело",
    "multiline": false
  },
  {
    "key": "copy_cvhhvm",
    "label": "Страница товара · Доступная длина",
    "defaultValue": "Доступная длина",
    "multiline": false
  },
  {
    "key": "copy_efux6c",
    "label": "Страница товара · Край",
    "defaultValue": "Край",
    "multiline": false
  },
  {
    "key": "copy_15q9fl2",
    "label": "Страница товара · Живой, природный",
    "defaultValue": "Живой, природный",
    "multiline": false
  },
  {
    "key": "copy_zxezoc",
    "label": "Страница товара · за погонный метр · демо-цена",
    "defaultValue": "за погонный метр · демо-цена",
    "multiline": false
  },
  {
    "key": "copy_a4e0mj",
    "label": "Страница товара · Настроить заказ",
    "defaultValue": "Настроить заказ",
    "multiline": false
  },
  {
    "key": "copy_ceuyrm",
    "label": "Страница товара · Добавить",
    "defaultValue": "Добавить",
    "multiline": false
  },
  {
    "key": "copy_15t4av5",
    "label": "Страница товара · Природные особенности — часть характера",
    "defaultValue": "Природные особенности — часть характера",
    "multiline": false
  },
  {
    "key": "copy_mdj44v",
    "label": "Страница товара · Сучки, трещины, неоднородный оттенок и неровный край делают древесину ",
    "defaultValue": "Сучки, трещины, неоднородный оттенок и неровный край делают древесину Кело узнаваемой. Фактическая форма и размеры конкретной доски уточняются по реальным фотографиям перед производством. Для ухода используйте мягкую сухую ткань; избегайте длительного контакта с водой.",
    "multiline": true
  },
  {
    "key": "copy_yuq0hl",
    "label": "Корзина · ВАШ ВЫБОР",
    "defaultValue": "ВАШ ВЫБОР",
    "multiline": false
  },
  {
    "key": "copy_1g2qeo",
    "label": "Корзина · Дерево для вашей истории.",
    "defaultValue": "Дерево для вашей истории.",
    "multiline": false
  },
  {
    "key": "copy_1g4956k",
    "label": "Корзина · Все размеры и детали обработки — в одном месте.",
    "defaultValue": "Все размеры и детали обработки — в одном месте.",
    "multiline": false
  },
  {
    "key": "copy_1csefsr",
    "label": "Корзина · Ваша доска ещё ждёт вас",
    "defaultValue": "Ваша доска ещё ждёт вас",
    "multiline": false
  },
  {
    "key": "copy_mp95az",
    "label": "Корзина · Выбрать слэб",
    "defaultValue": "Выбрать слэб",
    "multiline": false
  },
  {
    "key": "copy_1nw1kcj",
    "label": "Корзина · Собрать другой вариант",
    "defaultValue": "Собрать другой вариант",
    "multiline": false
  },
  {
    "key": "copy_1f1f0rd",
    "label": "Корзина · Продолжить выбирать",
    "defaultValue": "Продолжить выбирать",
    "multiline": false
  },
  {
    "key": "copy_1f3cdq7",
    "label": "Корзина · ВАШ ЗАКАЗ",
    "defaultValue": "ВАШ ЗАКАЗ",
    "multiline": false
  },
  {
    "key": "copy_1uakfca",
    "label": "Корзина · Природа — в деталях.",
    "defaultValue": "Природа — в деталях.",
    "multiline": false
  },
  {
    "key": "copy_1go91ko",
    "label": "Корзина · Изделия ·",
    "defaultValue": "Изделия ·",
    "multiline": false
  },
  {
    "key": "copy_1y448gj",
    "label": "Корзина · шт.",
    "defaultValue": "шт.",
    "multiline": false
  },
  {
    "key": "copy_10i0b8c",
    "label": "Корзина · Доставка",
    "defaultValue": "Доставка",
    "multiline": false
  },
  {
    "key": "copy_khzdxl",
    "label": "Корзина · При оформлении",
    "defaultValue": "При оформлении",
    "multiline": false
  },
  {
    "key": "copy_3nmayi",
    "label": "Корзина · Итого",
    "defaultValue": "Итого",
    "multiline": false
  },
  {
    "key": "copy_96vg35",
    "label": "Корзина · Оформить заказ",
    "defaultValue": "Оформить заказ",
    "multiline": false
  },
  {
    "key": "copy_145em6g",
    "label": "Корзина · Демонстрационные цены. Стоимость доставки добавляется при оформлении.",
    "defaultValue": "Демонстрационные цены. Стоимость доставки добавляется при оформлении.",
    "multiline": false
  },
  {
    "key": "copy_ylic3h",
    "label": "Корзина · Все параметры проверим перед изготовлением",
    "defaultValue": "Все параметры проверим перед изготовлением",
    "multiline": false
  },
  {
    "key": "copy_9ulj0i",
    "label": "Оформление заказа · ДЕМО-ЗАКАЗ СОХРАНЁН",
    "defaultValue": "ДЕМО-ЗАКАЗ СОХРАНЁН",
    "multiline": false
  },
  {
    "key": "copy_ul5hub",
    "label": "Оформление заказа · У вашей идеи",
    "defaultValue": "У вашей идеи",
    "multiline": false
  },
  {
    "key": "copy_1cmphgw",
    "label": "Оформление заказа · теперь есть форма.",
    "defaultValue": "теперь есть форма.",
    "multiline": false
  },
  {
    "key": "copy_l7l5od",
    "label": "Оформление заказа · Заказ",
    "defaultValue": "Заказ",
    "multiline": false
  },
  {
    "key": "copy_meia8w",
    "label": "Оформление заказа · появился в панели управления.",
    "defaultValue": "появился в панели управления.",
    "multiline": false
  },
  {
    "key": "copy_6y4wic",
    "label": "Оформление заказа · Материал зарезервирован в демонстрационном каталоге.",
    "defaultValue": "Материал зарезервирован в демонстрационном каталоге.",
    "multiline": false
  },
  {
    "key": "copy_xgge7r",
    "label": "Оформление заказа · Сумма",
    "defaultValue": "Сумма",
    "multiline": false
  },
  {
    "key": "copy_1bsbb4t",
    "label": "Оформление заказа · Реальная отправка и связь с менеджером не выполняются.",
    "defaultValue": "Реальная отправка и связь с менеджером не выполняются.",
    "multiline": false
  },
  {
    "key": "copy_15sq6pj",
    "label": "Оформление заказа · Вернуться в коллекцию",
    "defaultValue": "Вернуться в коллекцию",
    "multiline": false
  },
  {
    "key": "copy_p51z6a",
    "label": "Оформление заказа · Посмотреть заказ",
    "defaultValue": "Посмотреть заказ",
    "multiline": false
  },
  {
    "key": "copy_8caxrr",
    "label": "Оформление заказа · Начнём с красивой доски",
    "defaultValue": "Начнём с красивой доски",
    "multiline": false
  },
  {
    "key": "copy_1r4zh8n",
    "label": "Оформление заказа · ПОСЛЕДНИЕ ДЕТАЛИ",
    "defaultValue": "ПОСЛЕДНИЕ ДЕТАЛИ",
    "multiline": false
  },
  {
    "key": "copy_142lu0d",
    "label": "Оформление заказа · Оформление заказа.",
    "defaultValue": "Оформление заказа.",
    "multiline": false
  },
  {
    "key": "copy_xjkdfi",
    "label": "Оформление заказа · Это демонстрационная версия. Для проверки используйте вымышленные данн",
    "defaultValue": "Это демонстрационная версия. Для проверки используйте вымышленные данные.",
    "multiline": false
  },
  {
    "key": "copy_119gdab",
    "label": "Оформление заказа · Ваши контакты",
    "defaultValue": "Ваши контакты",
    "multiline": false
  },
  {
    "key": "copy_143058q",
    "label": "Оформление заказа · Имя",
    "defaultValue": "Имя",
    "multiline": false
  },
  {
    "key": "copy_1bxfcf1",
    "label": "Оформление заказа · Телефон",
    "defaultValue": "Телефон",
    "multiline": false
  },
  {
    "key": "copy_1v3lg91",
    "label": "Оформление заказа · Электронная почта",
    "defaultValue": "Электронная почта",
    "multiline": false
  },
  {
    "key": "copy_1ojq889",
    "label": "Оформление заказа · Необязательно",
    "defaultValue": "Необязательно",
    "multiline": false
  },
  {
    "key": "copy_1h96393",
    "label": "Оформление заказа · Бесплатно · адрес согласуем отдельно",
    "defaultValue": "Бесплатно · адрес согласуем отдельно",
    "multiline": false
  },
  {
    "key": "copy_1xm64ra",
    "label": "Оформление заказа · Город",
    "defaultValue": "Город",
    "multiline": false
  },
  {
    "key": "copy_1e9d7wp",
    "label": "Оформление заказа · Адрес",
    "defaultValue": "Адрес",
    "multiline": false
  },
  {
    "key": "copy_18rxqmk",
    "label": "Оформление заказа · Яндекс Доставка пока не подключена.",
    "defaultValue": "Яндекс Доставка пока не подключена.",
    "multiline": false
  },
  {
    "key": "copy_l7y8cj",
    "label": "Оформление заказа · Оплата",
    "defaultValue": "Оплата",
    "multiline": false
  },
  {
    "key": "copy_ancy8q",
    "label": "Оформление заказа · Онлайн-оплата · пример ЮKassa",
    "defaultValue": "Онлайн-оплата · пример ЮKassa",
    "multiline": false
  },
  {
    "key": "copy_1m201yi",
    "label": "Оформление заказа · Демонстрационный сценарий, без списания денег",
    "defaultValue": "Демонстрационный сценарий, без списания денег",
    "multiline": false
  },
  {
    "key": "copy_1c0ce61",
    "label": "Оформление заказа · После согласования",
    "defaultValue": "После согласования",
    "multiline": false
  },
  {
    "key": "copy_1h8ckqp",
    "label": "Оформление заказа · Параметры, сроки и доставка уточняются отдельно",
    "defaultValue": "Параметры, сроки и доставка уточняются отдельно",
    "multiline": false
  },
  {
    "key": "copy_1hf6f29",
    "label": "Оформление заказа · Комментарий к заказу",
    "defaultValue": "Комментарий к заказу",
    "multiline": false
  },
  {
    "key": "copy_1ott28g",
    "label": "Оформление заказа · Всё, что вы выбрали.",
    "defaultValue": "Всё, что вы выбрали.",
    "multiline": false
  },
  {
    "key": "copy_1hi5u8o",
    "label": "Оформление заказа · мм ·",
    "defaultValue": "мм ·",
    "multiline": false
  },
  {
    "key": "copy_1l3yzxx",
    "label": "Оформление заказа · Менсолодержатели ·",
    "defaultValue": "Менсолодержатели ·",
    "multiline": false
  },
  {
    "key": "copy_14th25i",
    "label": "Оформление заказа · Подарочная упаковка ·",
    "defaultValue": "Подарочная упаковка ·",
    "multiline": false
  },
  {
    "key": "copy_1sytim7",
    "label": "Оформление заказа · Согласен на сохранение указанных данных для проверки демо-заказа. Пони",
    "defaultValue": "Согласен на сохранение указанных данных для проверки демо-заказа. Понимаю, что реальная оплата и доставка не выполняются.",
    "multiline": true
  },
  {
    "key": "copy_1us0qak",
    "label": "Оформление заказа · Без ввода данных карты. Деньги не списываются.",
    "defaultValue": "Без ввода данных карты. Деньги не списываются.",
    "multiline": false
  },
  {
    "key": "copy_1cfuoij",
    "label": "Оформление заказа · Вернуться в корзину",
    "defaultValue": "Вернуться в корзину",
    "multiline": false
  },
  {
    "key": "copy_1h3t0st",
    "label": "Изделия · Кело в вашем доме",
    "defaultValue": "Кело в вашем доме",
    "multiline": false
  },
  {
    "key": "copy_rdabpt",
    "label": "Изделия · Изделия.",
    "defaultValue": "Изделия.",
    "multiline": false
  },
  {
    "key": "copy_1e3jmh",
    "label": "Изделия · Все изделия",
    "defaultValue": "Все изделия",
    "multiline": false
  },
  {
    "key": "copy_9u9ogt",
    "label": "Изделия · Выберите изделие",
    "defaultValue": "Выберите изделие",
    "multiline": false
  },
  {
    "key": "copy_bhm2k2",
    "label": "Изделия · Отзывы об изделии",
    "defaultValue": "Отзывы об изделии",
    "multiline": false
  },
  {
    "key": "copy_1yol2tm",
    "label": "Изделия · Фотографии — демонстрационные примеры. Размеры, обработку, крепления и",
    "defaultValue": "Фотографии — демонстрационные примеры. Размеры, обработку, крепления и упаковку можно выбрать в редакторе заказа.",
    "multiline": true
  },
  {
    "key": "copy_ok7ezg",
    "label": "Витрина · Изделия из Кело — KELO WOOD MARKET",
    "defaultValue": "Изделия из Кело — KELO WOOD MARKET",
    "multiline": false
  },
  {
    "key": "copy_p846sb",
    "label": "Витрина · Полки, подоконники и полки для кухни из сосны Кело с полированной пове",
    "defaultValue": "Полки, подоконники и полки для кухни из сосны Кело с полированной поверхностью и естественным живым краем.",
    "multiline": true
  },
  {
    "key": "copy_vk0qdm",
    "label": "Страница изделий · Натуральное дерево. Для жизни.",
    "defaultValue": "Натуральное дерево. Для жизни.",
    "multiline": false
  },
  {
    "key": "copy_er4fgr",
    "label": "Страница изделий · Полки и подоконники из сосны Кело.",
    "defaultValue": "Полки и подоконники из сосны Кело.",
    "multiline": false
  },
  {
    "key": "copy_hpplnj",
    "label": "Страница изделий · Ровная полированная поверхность и неповторимый природный край.",
    "defaultValue": "Ровная полированная поверхность и неповторимый природный край.",
    "multiline": false
  },
  {
    "key": "copy_13mwl3c",
    "label": "Отзывы · Загружаем отзывы…",
    "defaultValue": "Загружаем отзывы…",
    "multiline": false
  },
  {
    "key": "copy_oarxuo",
    "label": "Отзывы · Попробовать ещё раз",
    "defaultValue": "Попробовать ещё раз",
    "multiline": false
  },
  {
    "key": "copy_o8wql8",
    "label": "Отзывы · Пока нет отзывов. Поделитесь первым впечатлением об этом изделии.",
    "defaultValue": "Пока нет отзывов. Поделитесь первым впечатлением об этом изделии.",
    "multiline": false
  },
  {
    "key": "copy_11je51s",
    "label": "Отзывы · Написать отзыв",
    "defaultValue": "Написать отзыв",
    "multiline": false
  },
  {
    "key": "copy_1f02ucp",
    "label": "Отзывы · Ваше имя",
    "defaultValue": "Ваше имя",
    "multiline": false
  },
  {
    "key": "copy_kxz9lh",
    "label": "Отзывы · Ваш отзыв",
    "defaultValue": "Ваш отзыв",
    "multiline": false
  },
  {
    "key": "copy_1pnchey",
    "label": "Отзывы · От 10 до 2000 символов",
    "defaultValue": "От 10 до 2000 символов",
    "multiline": false
  },
  {
    "key": "copy_z120ho",
    "label": "Отзывы · Имя и текст отзыва будут видны посетителям сайта. Не указывайте телефо",
    "defaultValue": "Имя и текст отзыва будут видны посетителям сайта. Не указывайте телефон и другие личные данные.",
    "multiline": true
  },
  {
    "key": "copy_1tyk9kl",
    "label": "Примеры · Журнальный стол",
    "defaultValue": "Журнальный стол",
    "multiline": false
  },
  {
    "key": "copy_4thxoh",
    "label": "Примеры · Тонкая столешница из доски Кело толщиной 40 мм на металлическом подсто",
    "defaultValue": "Тонкая столешница из доски Кело толщиной 40 мм на металлическом подстолье. Пример использования доски размером 110 × 40 см.",
    "multiline": true
  },
  {
    "key": "copy_1qx934o",
    "label": "Примеры · Консоль для прихожей",
    "defaultValue": "Консоль для прихожей",
    "multiline": false
  },
  {
    "key": "copy_wu4mf",
    "label": "Примеры · Неглубокая столешница из массива и тонкие опоры. Место для вещей, кото",
    "defaultValue": "Неглубокая столешница из массива и тонкие опоры. Место для вещей, которые хочется оставить на виду.",
    "multiline": true
  },
  {
    "key": "copy_1dopuiz",
    "label": "Примеры · Подоконник из массива",
    "defaultValue": "Подоконник из массива",
    "multiline": false
  },
  {
    "key": "copy_1ui0qhb",
    "label": "Примеры · Тёплая деревянная поверхность у окна. Прямой задний спил и живой край ",
    "defaultValue": "Тёплая деревянная поверхность у окна. Прямой задний спил и живой край со стороны комнаты.",
    "multiline": true
  },
  {
    "key": "copy_1dgde1f",
    "label": "Изделия · Полка",
    "defaultValue": "Полка",
    "multiline": false
  },
  {
    "key": "copy_135m3t",
    "label": "Изделия · Для книг, любимых вещей и небольших коллекций. Полированная сосна Кело",
    "defaultValue": "Для книг, любимых вещей и небольших коллекций. Полированная сосна Кело с естественным живым краем.",
    "multiline": true
  },
  {
    "key": "copy_7qw6ma",
    "label": "Изделия · Подоконник",
    "defaultValue": "Подоконник",
    "multiline": false
  },
  {
    "key": "copy_1dw3m8i",
    "label": "Изделия · Тёплая деревянная поверхность у окна. Ровный задний спил для примыкани",
    "defaultValue": "Тёплая деревянная поверхность у окна. Ровный задний спил для примыкания и природный край со стороны комнаты.",
    "multiline": true
  },
  {
    "key": "copy_1960nxe",
    "label": "Изделия · Полка для кухни",
    "defaultValue": "Полка для кухни",
    "multiline": false
  },
  {
    "key": "copy_16o6qlp",
    "label": "Изделия · Открытая полка для чашек, посуды и повседневных мелочей. Натуральная ф",
    "defaultValue": "Открытая полка для чашек, посуды и повседневных мелочей. Натуральная фактура дерева в кухонном пространстве.",
    "multiline": true
  },
  {
    "key": "copy_ck4k4o",
    "label": "Навигация · Редактор",
    "defaultValue": "Редактор",
    "multiline": false
  },
  {
    "key": "copy_adcc4n",
    "label": "Навигация · Редактор доски",
    "defaultValue": "Редактор доски",
    "multiline": false
  },
  {
    "key": "copy_otf3r",
    "label": "Навигация · О Кело",
    "defaultValue": "О Кело",
    "multiline": false
  },
  {
    "key": "copy_16teln2",
    "label": "Навигация · Мы на WB",
    "defaultValue": "Мы на WB",
    "multiline": false
  }
,
{key:hashContentText("Вход и регистрация"),label:"Навигация · Вход и регистрация",defaultValue:"Вход и регистрация",multiline:false},
{key:hashContentText("Ваше место"),label:"Аккаунт · Ваше место",defaultValue:"Ваше место",multiline:false},
{key:hashContentText("в истории Кело."),label:"Аккаунт · в истории Кело.",defaultValue:"в истории Кело.",multiline:false},
{key:hashContentText("Войдите, чтобы поделиться впечатлением об изделии. Для оформления заказа регистрация не нужна."),label:"Аккаунт · Войдите, чтобы поделиться впечатлением об изделии. Для ",defaultValue:"Войдите, чтобы поделиться впечатлением об изделии. Для оформления заказа регистрация не нужна.",multiline:false},
{key:hashContentText("Поделитесь своим впечатлением"),label:"Отзывы · Поделитесь своим впечатлением",defaultValue:"Поделитесь своим впечатлением",multiline:false},
{key:hashContentText("Чтобы оставить отзыв, войдите или зарегистрируйтесь. Для заказа аккаунт не нужен."),label:"Отзывы · Чтобы оставить отзыв, войдите или зарегистрируйтесь. Дл",defaultValue:"Чтобы оставить отзыв, войдите или зарегистрируйтесь. Для заказа аккаунт не нужен.",multiline:false},
{key:hashContentText("При регистрации сохраняются имя, email и хеш пароля. Имя и текст отзыва видны посетителям; email и хеш пароля не публикуются. Для заказа аккаунт не обязателен."),label:"Обработка данных · При регистрации сохраняются имя, email и хеш пароля. Им",defaultValue:"При регистрации сохраняются имя, email и хеш пароля. Имя и текст отзыва видны посетителям; email и хеш пароля не публикуются. Для заказа аккаунт не обязателен.",multiline:true}
];
export const DEFAULT_SITE_CONTENT:Record<string,string>=Object.fromEntries(SITE_CONTENT_FIELDS.map(field=>[field.key,field.defaultValue]));

const contentKeyByDefault=new Map(SITE_CONTENT_FIELDS.map(field=>[field.defaultValue,field.key]));
export function siteContentKey(text:string){return contentKeyByDefault.get(text)??hashContentText(text);}
