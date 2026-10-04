// Category metadata isn't modeled in the database (Product.category is just
// a string) it stays here as static display config, separate from the
// actual product data which now comes from the API.
export const categoryDetails = {
  tops: { title: 'Shirts', kicker: 'Everyday form', description: 'Refined staples that hold their own from day to night.', cover: '/images/tops/IMG-2.jpeg' },
  hoodies: { title: 'Hoodies', kicker: 'Layer up', description: 'Soft, substantial layers made for the long haul.', cover: '/images/hoodies/Hoodie-2.jpeg' },
  sneakers: { title: 'Sneakers', kicker: 'Step out', description: 'Silhouettes that bring energy to every move.', cover: '/images/sneakers/Sneakers%20Collection.jpeg' },
}

export const productImage = (image) => encodeURI(`/images/${image}`)