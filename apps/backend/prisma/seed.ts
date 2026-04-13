import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default super admin
  const hashedPassword = await bcrypt.hash('admin1234', 10);
  await prisma.admin.upsert({
    where: { loginId: 'superadmin' },
    update: {},
    create: {
      loginId: 'superadmin',
      name: '최고관리자',
      password: hashedPassword,
      role: 'SUPER',
      isEnabled: true,
    },
  });

  await prisma.admin.upsert({
    where: { loginId: 'admin' },
    update: {},
    create: {
      loginId: 'admin',
      name: '관리자',
      password: hashedPassword,
      role: 'ADMIN',
      isEnabled: true,
    },
  });

  // Create default app settings
  await prisma.appSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      defaultLocale: 'ko-kr',
      international: false,
      lastOrderNumber: 0,
    },
  });

  // Create sample model group
  const modelGroup = await prisma.modelGroup.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '레벨센서',
      priority: 1,
    },
  });

  // Create sample model
  await prisma.model.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'DT-200',
      orderingName: 'DT-200',
      priority: 1,
      departments: ['SENSOR'],
      modelGroupId: modelGroup.id,
    },
  });

  // Create sample employee
  await prisma.employee.upsert({
    where: { employeeNumber: 'EMP-001' },
    update: {},
    create: {
      name: '홍길동',
      position: 'F_MANAGER',
      jobGroup: 'SALES',
      headquarter: 'SALES_DIVISION',
      department: 'SALES',
      employeeNumber: 'EMP-001',
      gender: 'MALE',
      employmentStatus: 'ACTIVE',
      joinDate: new Date('2020-01-15'),
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
