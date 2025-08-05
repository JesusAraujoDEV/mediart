'use strict';

// Shared text/normalization utilities

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘`]/g, "'")
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();
}

// Clean LLM query lines and dedupe preserving order
function cleanAndDedupeQueries(queries, itemName = '') {
  const seen = new Set();
  const cleaned = (queries || [])
    .map(q => q.replace(/(\d+\.\s*|["'*`_])/g, '').trim())
    .map(q => q.replace(/\s+-\s+/g, ' - '))
    .filter(q => q.length > 0)
    .filter(q => {
      const key = q.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .filter(q => q.toLowerCase() !== String(itemName || '').toLowerCase());
  return cleaned;
}

module.exports = {
  normalize,
  cleanAndDedupeQueries,
};