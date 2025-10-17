import { prisma } from '../lib/prisma';

async function main() {
  await prisma.car.createMany({
    data: [
      {
        title: 'Honda Civic 1.8',
        brand: 'Honda',
        model: 'Civic',
        year: 2008,
        price_text: 'Do negocjacji',
        status: 'available',
        purchase_price_pln: 0,
        sale_price_pln: 0,
      },
      {
        title: 'BMW 320d',
        brand: 'BMW',
        model: '3',
        year: 2013,
        price_text: 'Faktura VAT',
        status: 'available',
        purchase_price_pln: 0,
        sale_price_pln: 0,
      },
    ],
  });
}

main()
  .then(async () => {
    console.log('Seed done');
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
