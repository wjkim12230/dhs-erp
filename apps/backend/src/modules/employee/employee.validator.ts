import { z } from 'zod';
import { Gender, Position, JobGroup, Headquarter, Department, EmploymentStatus } from '@prisma/client';

export const employeeCreateSchema = z.object({
  name: z.string().min(1),
  position: z.nativeEnum(Position),
  jobGroup: z.nativeEnum(JobGroup),
  headquarter: z.nativeEnum(Headquarter),
  department: z.nativeEnum(Department),
  employeeNumber: z.string().min(1),
  internalNumber: z.string().optional(),
  contact: z.string().optional(),
  address: z.string().optional(),
  salary: z.number().int().optional(),
  birthDate: z.string().optional(),
  gender: z.nativeEnum(Gender),
  ssn: z.string().optional(),
  employmentStatus: z.nativeEnum(EmploymentStatus).optional(),
  joinDate: z.string().optional(),
  memo: z.string().optional(),
});

export const employeeUpdateSchema = employeeCreateSchema.partial().extend({
  version: z.number().int(),
});

export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;
