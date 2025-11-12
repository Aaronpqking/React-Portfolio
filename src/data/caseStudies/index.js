/**
 * @typedef {{ label:string, value:string, tooltip?:string }} Metric
 * @typedef {{ label:string, href:string }} LinkOut
 * @typedef {{ type:'image'|'video', src:string, alt:string, caption?:string, poster?:string }} Media
 * @typedef {{
 *  slug:string, title:string, client?:string, industry?:string, timeframe?:string, role:string,
 *  problem:string, approach:string[], solution:string,
 *  stack:string[], outcomes:Metric[], highlights?:string[],
 *  media:Media[], links?:LinkOut[], testimonial?:{quote:string, author:string, title?:string},
 *  tags?:string[], seo?:{description?:string, keywords?:string[]}
 * }} CaseStudy
 */

import de from './digital-events.json';
import grant from './grant-ai.json';
import eleanor from './eleanor-ai.json';

export const CASE_STUDIES = [de, grant, eleanor]; // /** @type {CaseStudy[]} */

export const getBySlug = (slug) => CASE_STUDIES.find(s => s.slug === slug);

export const getFacets = () => {
  const s = CASE_STUDIES;
  const uniq = (arr) => [...new Set(arr.filter(Boolean))];
  return {
    industries: uniq(s.map(x => x.industry)),
    stacks: uniq(s.flatMap(x => x.stack || [])),
    tags: uniq(s.flatMap(x => x.tags || [])),
  };
};

