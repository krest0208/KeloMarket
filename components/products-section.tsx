import {SiteText} from '@/components/site-content';
import {ProductAvailability} from '@/components/storefront';
import {ProductReviews} from '@/components/product-reviews';
import {productOfferings} from '@/lib/product-offerings';

export function ProductsSection({compact = false}: {compact?: boolean}) {
  const titleId = compact ? 'home-products-title' : 'products-list-title';
  return <section className={`section container products-section${compact ? ' products-section-compact' : ''}`} id="products" aria-labelledby={titleId}>
    {compact ? <div className="section-title products-section-heading">
      <div><p className="eyebrow"><SiteText text={"Кело в вашем доме"}/></p><h2 id={titleId}><SiteText text={"Изделия."}/></h2></div>
      <a className="products-all-link" href="/products"><SiteText text={"Все изделия"}/></a>
    </div> : <h2 className="sr-only" id={titleId}><SiteText text={"Выберите изделие"}/></h2>}
    <div className="products-offerings-grid">
      {productOfferings.map(offering => <article className="product-offering-card product-card" key={offering.id}>
        <a className="product-offering-media" href={offering.href} aria-label={`Настроить изделие: ${offering.title.toLowerCase()}`}>
          <img src={offering.image} alt={offering.alt} width="1536" height="1024" loading="lazy" decoding="async"/>
        </a>
        <div className="product-offering-copy">
          <h3>{<SiteText text={offering.title}/>}</h3>
          <ProductAvailability productId={offering.productId}/>
          <p>{<SiteText text={offering.description}/>}</p>
          <a className="btn product-offering-order" href={offering.href} aria-label={`Заказать: ${offering.title.toLowerCase()}`}><SiteText text={"Заказать"}/></a>
        </div>
        <details className="offering-review-details"><summary><SiteText text={"Отзывы об изделии"}/></summary><ProductReviews productId={offering.reviewId} title={offering.title} compact/></details>
      </article>)}
    </div>
    <p className="fine-print products-demo-note"><SiteText text={"Фотографии — демонстрационные примеры. Размеры, обработку, крепления и упаковку можно выбрать в редакторе заказа."}/></p>
  </section>;
}
