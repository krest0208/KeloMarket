import {SiteText} from '@/components/site-content';
import {AdditionalProducts} from '@/components/storefront';
import type {Metadata} from 'next';
import {ProductsSection} from '@/components/products-section';

export const metadata: Metadata = {
  title: 'Изделия из Кело — KELO WOOD MARKET',
  description: 'Полки, подоконники и полки для кухни из сосны Кело с полированной поверхностью и естественным живым краем.',
};

export default function ProductsPage() {
  return <main id="main" className="products-page">
    <div className="container">
      <nav className="breadcrumb" aria-label="Хлебные крошки"><a href="/"><SiteText text={"Главная"}/></a><span aria-hidden="true">/</span><span aria-current="page"><SiteText text={"Изделия"}/></span></nav>
      <div className="page-title products-page-title">
        <p className="eyebrow"><SiteText text={"Натуральное дерево. Для жизни."}/></p>
        <h1><SiteText text={"Изделия."}/></h1>
        <p><SiteText text={"Полки и подоконники из сосны Кело."}/><br/><SiteText text={"Ровная полированная поверхность и неповторимый природный край."}/></p>
      </div>
    </div>
    <ProductsSection/><AdditionalProducts/>
  </main>;
}
