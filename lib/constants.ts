export const CONTENT_TYPES = [
  'brand',
  'product',
  'yarn-school',
  'education',
  'faq',
  'policy',
  'chatbot-faq',
  'email-example',
  'content-reference',
  'visual-reference',
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const TYPE_LABELS: Record<ContentType, string> = {
  brand: 'Brand',
  product: 'Product',
  'yarn-school': 'Yarn School',
  education: 'Education',
  faq: 'FAQ',
  policy: 'Policy',
  'chatbot-faq': 'Chatbot FAQ',
  'email-example': 'Email Example',
  'content-reference': 'Content Ref',
  'visual-reference': 'Visual Ref',
};

export const TYPE_COLOURS: Record<ContentType, string> = {
  brand: '#23706c',
  product: '#193c27',
  'yarn-school': '#6f235f',
  education: '#493038',
  faq: '#9c8060',
  policy: '#6b7280',
  'chatbot-faq': '#b45309',
  'email-example': '#1d4ed8',
  'content-reference': '#7c3aed',
  'visual-reference': '#be185d',
};
