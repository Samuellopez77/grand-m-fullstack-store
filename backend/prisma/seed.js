import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Same source data as frontend/src/products.js — kept in sync manually for
// now. Once the frontend fetches from the API, this file becomes the single
// source of truth and products.js's arrays can be deleted.
const tops = [
  ['IMG-1.jpeg', 'Classic YSL black', 1290],
  ['IMG-2.jpeg', 'Classic YSL brown', 1450],
  ['IMG-3.jpeg', 'Classic YSL cream', 1100],
  ['IMG-8.jpeg', 'Classic YSL white', 1600],
  ['IMG-5.jpeg', 'Zipped style army green', 1600],
  ['IMG-6.jpeg', 'Classic men cream', 1600],
  ['IMG-7.jpeg', 'Classic Lacoste blue', 1600],
];

const hoodies = [
  ['Hoodie-2.jpeg', 'ShadowWrap', 2999],
  ['Hoodie-3.jpeg', 'Ember Hoodie', 2499],
  ['Hoodie-4.jpeg', 'Cozy Hoodie', 2499],
  ['Hoodie-5.jpeg', 'Titan Pull', 2499],
  ['Hoodie-6.jpeg', 'Cloud Comfort', 2499],
  ['Hoodie-7.jpeg', 'Nova Hood', 2499],
  ['hoody_1.jpeg', 'Pulse Pull', 2499],
  ['hoody_2.jpeg', 'Eclipse Hoodie', 2499],
  ['hoody_3.jpeg', 'Glow Hood', 2499],
  ['hoody_4.jpeg', 'Phantom Wrap', 2499],
  ['hoody_5.jpeg', 'Drift Wear', 2499],
  ['hoody_6.jpeg', 'Core Comfort', 2499],
  ['hoody_7.jpeg', 'Zenith Hoodie', 2499],
  ['hoody_8.jpeg', 'Arctic Wrap', 2499],
  ['hoody_9.jpeg', 'Skyline Pull', 2499],
  ['hoody_10.jpeg', 'Lume Hood', 2499],
  ['hoody_11.jpeg', 'Voyager Hood', 2499],
  ['hoody_12.jpeg', 'Classic Style', 2499],
];

const sneakers = [
  ['Nike.jpeg', 'Nike Runner', 6500],
  ['shoe-1.jpeg', 'Neo Step', 4800],
  ['shoe-2.jpeg', 'PUMA Classic', 4800],
  ['shoe-3.jpeg', 'Quantum Air', 4800],
  ['shoe-4.jpeg', 'SB Aero Zoom', 4800],
  ['shoe-5.jpeg', 'Nike SB', 4800],
  ['shoe-6.jpeg', 'Air Pulse', 4800],
  ['shoe-7.jpeg', 'SB Jet Shift', 4800],
  ['shoe-8.jpeg', 'SB Turbo Flex', 4800],
  ['shoe-9.jpeg', 'Swift Lift', 4800],
  ['shoe-10.jpeg', 'Flash Stride', 4800],
  ['shoe-11.jpeg', 'Vortex Run', 4800],
  ['shoe-12.jpeg', 'Sneaker Model', 4800],
  ['shoe-13.jpeg', 'Surge Step', 4800],
  ['shoe-14.jpeg', 'Lunar Sprint', 4800],
  ['shoe-15.jpeg', 'Edge Walk', 4800],
  ['shoe-16.jpeg', 'Ember Walk', 4800],
  ['shoe-17.jpeg', 'Ignite Kicks', 4800],
  ['shoe-18.jpeg', 'Quantum Air II', 4800],
  ['shoe-19.jpeg', 'Blaze Fly', 4800],
  ['shoe-20.jpeg', 'Apex Zoom', 4800],
  ['shoe-21.jpeg', 'Lunar Sprint Grey', 4800],
  ['shoe-22.jpeg', 'Hyper Stride', 4800],
  ['Sneaker.jpeg', 'Drift Motion', 4800],
  ['Sneaker2.jpeg', 'Glide Zone', 4800],
  ['Sneaker3.jpeg', 'Titan Kicks', 4800],
  ['Sneaker4.jpeg', 'Apex Runner', 4800],
  ['Sneaker5.jpeg', 'Skyline Soles', 4800],
];

// Matches frontend/src/products.js's toProducts() — same image path
// convention ("category/filename.jpeg") so <img src> keeps working
// unchanged once the frontend switches to fetching from the API.
function toProductRows(entries, category) {
  return entries.map(([image, name, price]) => ({
    name,
    category,
    price,
    image: `${category}/${image}`,
    stock: 25, // arbitrary starting stock — adjust per product later if needed
  }));
}

async function main() {
  const rows = [
    ...toProductRows(tops, 'tops'),
    ...toProductRows(hoodies, 'hoodies'),
    ...toProductRows(sneakers, 'sneakers'),
  ];

  console.log(`Seeding ${rows.length} products...`);

  // Wipe existing products first so re-running this script is safe/idempotent
  // instead of piling up duplicates on every run.
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: rows });

  console.log('Done.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });