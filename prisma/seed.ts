import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Demo@123', 12);
  await db.user.upsert({ where: { email: 'admin@lastmile.test' }, update: {}, create: { name: 'Aarav Admin', email: 'admin@lastmile.test', passwordHash, role: 'ADMIN' } });
  const zones = await Promise.all(['ZONE_A', 'ZONE_B', 'ZONE_C', 'ZONE_D'].map((code, index) => db.zone.upsert({ where: { code }, update: {}, create: { code, name: `Service Zone ${String.fromCharCode(65 + index)}` } })));
  const serviceAreas = [
    { postalCode: '532001', name: 'Area 1', city: 'Visakhapatnam', zoneId: zones[0].id },
    { postalCode: '532002', name: 'Area 2', city: 'Visakhapatnam', zoneId: zones[1].id },
    { postalCode: '532003', name: 'Area 3', city: 'Visakhapatnam', zoneId: zones[2].id },
    { postalCode: '532004', name: 'Area 4', city: 'Visakhapatnam', zoneId: zones[3].id },
    { postalCode: '522241', name: 'Vijayawada service area', city: 'Vijayawada', zoneId: zones[0].id },
  ];
  await Promise.all(serviceAreas.map(area => db.area.upsert({ where: { postalCode: area.postalCode }, update: { name: area.name, city: area.city, state: 'Andhra Pradesh', zoneId: area.zoneId, active: true }, create: { ...area, state: 'Andhra Pradesh' } })));
  for (const [orderType, zoneType, ratePerKg] of [['B2B', 'INTRA_ZONE', 45], ['B2B', 'INTER_ZONE', 65], ['B2C', 'INTRA_ZONE', 55], ['B2C', 'INTER_ZONE', 80]] as const) await db.rateCard.upsert({ where: { orderType_zoneType: { orderType, zoneType } }, update: { ratePerKg }, create: { orderType, zoneType, ratePerKg } });
  for (const [orderType, amount] of [['B2B', 25], ['B2C', 30]] as const) await db.codSurcharge.upsert({ where: { orderType }, update: { amount }, create: { orderType, amount } });
  for (let index = 1; index <= 5; index++) { await db.user.upsert({ where: { email: `customer${index}@lastmile.test` }, update: {}, create: { name: `Customer ${index}`, email: `customer${index}@lastmile.test`, passwordHash, role: 'CUSTOMER', customer: { create: {} } } }); if (index <= 4) await db.user.upsert({ where: { email: `agent${index}@lastmile.test` }, update: {}, create: { name: `Agent ${index}`, email: `agent${index}@lastmile.test`, passwordHash, role: 'AGENT', agent: { create: { availability: index === 1 ? 'AVAILABLE' : 'OFFLINE', currentZoneId: zones[index - 1].id, currentLatitude: 17.7 + index / 100, currentLongitude: 83.2 + index / 100 } } } }); }
  console.log({ admin: 'admin@lastmile.test', password: 'Demo@123' });
}
main().finally(() => db.$disconnect());
