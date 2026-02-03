export default async function sitemap() {
  const baseUrl = 'https://unitedfurniture.ae';

  // Static routes
  const staticRoutes = [
    '',
    '/aboutus',
    '/contactus',
    '/shop',
    '/categories',
    '/sofas',
    '/curtains',
    '/outdoor',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // In a real app, you would fetch dynamic product and category slugs from your database here
  // Example:
  // const products = await getProducts();
  // const productRoutes = products.map((p) => ({ ... }))

  return [...staticRoutes];
}
