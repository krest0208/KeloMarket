import {SiteText} from '@/components/site-content';
import type {ComponentPropsWithoutRef} from 'react';
import {WILDBERRIES_URL} from '@/lib/site-navigation';

type MarketplaceLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'target' | 'rel'>;

/** The marketplace destination is supplied by the owner, not derived from catalogue data. */
export function MarketplaceLink({children = 'Мы на WB', ...props}: MarketplaceLinkProps) {
  return <a {...props} href={WILDBERRIES_URL} target="_blank" rel="noopener noreferrer">
    <SiteText text={children}/><span className="sr-only"> (откроется в новой вкладке)</span>
  </a>;
}
