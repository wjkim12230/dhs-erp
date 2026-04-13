// ============================================================
// Enums
// ============================================================

export enum Role {
  SUPER = 'SUPER',
  ADMIN = 'ADMIN',
  PRODUCTION = 'PRODUCTION',
  USER = 'USER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  LEAVE = 'LEAVE',
  RETIRED = 'RETIRED',
}

export enum Position {
  A_CEO = 'A_CEO',
  B_VICE_CEO = 'B_VICE_CEO',
  C_EXECUTIVE = 'C_EXECUTIVE',
  D_GENERAL_MANAGER = 'D_GENERAL_MANAGER',
  E_DEPUTY_MANAGER = 'E_DEPUTY_MANAGER',
  F_MANAGER = 'F_MANAGER',
  G_ASSISTANT_MANAGER = 'G_ASSISTANT_MANAGER',
  H_SENIOR_STAFF = 'H_SENIOR_STAFF',
  I_STAFF = 'I_STAFF',
}

export enum JobGroup {
  C_LEVEL = 'C_LEVEL',
  MANAGEMENT = 'MANAGEMENT',
  RESEARCH_CENTER = 'RESEARCH_CENTER',
  SALES = 'SALES',
  PRODUCTION = 'PRODUCTION',
}

export enum Headquarter {
  DAEHYUN_SENSOR = 'DAEHYUN_SENSOR',
  PRODUCT_DIVISION = 'PRODUCT_DIVISION',
  RESEARCH_CENTER = 'RESEARCH_CENTER',
  ADMIN_DIVISION = 'ADMIN_DIVISION',
  SALES_DIVISION = 'SALES_DIVISION',
}

export enum Department {
  DHS = 'DHS',
  ADMIN_SUPPORT = 'ADMIN_SUPPORT',
  RESEARCH_CENTER = 'RESEARCH_CENTER',
  MARKETING = 'MARKETING',
  SENSOR = 'SENSOR',
  UNIT = 'UNIT',
  PURCHASING = 'PURCHASING',
  SALES = 'SALES',
  SALES_DIV1 = 'SALES_DIV1',
  SALES_DIV2 = 'SALES_DIV2',
  DLF = 'DLF',
  A_S = 'A_S',
  PROJECT_SALES = 'PROJECT_SALES',
  GLOBAL_SALES = 'GLOBAL_SALES',
  ACCOUNTING = 'ACCOUNTING',
  PACKAGING = 'PACKAGING',
  PRODUCT = 'PRODUCT',
  MACHINING = 'MACHINING',
}

export enum OrderingTeam {
  SENSOR = 'SENSOR',
  UNIT = 'UNIT',
  DLF = 'DLF',
}

export enum OrderStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DELETED = 'DELETED',
}

// ============================================================
// Common Types
// ============================================================

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  updatedBy: number | null;
  isDeleted: boolean;
  version: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// ============================================================
// Auth
// ============================================================

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthUser {
  id: number;
  loginId: string;
  name: string;
  role: Role;
}

// ============================================================
// Employee
// ============================================================

export interface Employee extends BaseEntity {
  name: string;
  position: Position;
  jobGroup: JobGroup;
  headquarter: Headquarter;
  department: Department;
  employeeNumber: string;
  internalNumber: string | null;
  contact: string | null;
  address: string | null;
  salary: number | null;
  birthDate: string | null;
  gender: Gender;
  ssn: string | null;
  employmentStatus: EmploymentStatus;
  joinDate: string | null;
  leaveDate: string | null;
  resignDate: string | null;
  memo: string | null;
}

export interface EmployeeCreateDto {
  name: string;
  position: Position;
  jobGroup: JobGroup;
  headquarter: Headquarter;
  department: Department;
  employeeNumber: string;
  internalNumber?: string;
  contact?: string;
  address?: string;
  salary?: number;
  birthDate?: string;
  gender: Gender;
  ssn?: string;
  employmentStatus?: EmploymentStatus;
  joinDate?: string;
  memo?: string;
}

export interface EmployeeUpdateDto extends Partial<EmployeeCreateDto> {
  version: number;
}

export interface EmployeeFilter extends PaginationParams {
  name?: string;
  department?: Department;
  employmentStatus?: EmploymentStatus;
  headquarter?: Headquarter;
}

// ============================================================
// Model
// ============================================================

export interface ModelGroup extends BaseEntity {
  name: string;
  priority: number;
  models?: Model[];
}

export interface Model extends BaseEntity {
  name: string;
  orderingName: string | null;
  priority: number;
  departments: Department[];
  modelGroupId: number;
  modelGroup?: ModelGroup;
  modelDetails?: ModelDetail[];
  drawings?: Drawing[];
  specifications?: Specification[];
  checkItems?: CheckItem[];
}

export interface ModelDetail extends BaseEntity {
  name: string;
  priority: number;
  modelId: number;
}

export interface ModelCreateDto {
  name: string;
  orderingName?: string;
  priority?: number;
  departments?: Department[];
  modelGroupId: number;
}

export interface ModelGroupCreateDto {
  name: string;
  priority?: number;
}

// ============================================================
// Specification
// ============================================================

export interface Specification extends BaseEntity {
  name: string;
  priority: number;
  modelId: number;
  specificationDetails?: SpecificationDetail[];
}

export interface SpecificationDetail extends BaseEntity {
  name: string;
  orderingValue: string | null;
  priority: number;
  specificationId: number;
}

export interface SpecificationCreateDto {
  name: string;
  priority?: number;
  modelId: number;
}

export interface SpecificationDetailCreateDto {
  name: string;
  orderingValue?: string;
  priority?: number;
}

// ============================================================
// Drawing
// ============================================================

export interface Drawing extends BaseEntity {
  imageUrl: string;
  lengthCount: number | null;
  modelId: number;
  drawingToSpecifications?: DrawingToSpecification[];
}

export interface DrawingToSpecification extends BaseEntity {
  relation: boolean;
  basic: string | null;
  significant: string | null;
  drawingId: number;
  specificationId: number;
  specificationDetails?: SpecificationDetail[];
}

export interface DrawingCreateDto {
  imageUrl: string;
  lengthCount?: number;
  modelId: number;
}

// ============================================================
// Check Item
// ============================================================

export interface CheckItem extends BaseEntity {
  name: string;
  priority: number;
  modelId: number;
  checkItemDetails?: CheckItemDetail[];
}

export interface CheckItemDetail extends BaseEntity {
  name: string;
  priority: number;
  checkItemId: number;
}

export interface CheckItemCreateDto {
  name: string;
  priority?: number;
  modelId: number;
}

// ============================================================
// Ordering
// ============================================================

export interface Ordering extends BaseEntity {
  customerName: string;
  siteName: string | null;
  orderer: string | null;
  customerContact: string | null;
  orderDate: string | null;
  dueDate: string | null;
  orderNumber: string;
  l1: string | null;
  l2: string | null;
  l3: string | null;
  l4: string | null;
  l5: string | null;
  l6: string | null;
  quantity: string | null;
  expectedDeliveryDate: string | null;
  memo: string | null;
  status: OrderStatus;
  modelId: number;
  model?: Model;
  orderEmployeeId: number | null;
  orderEmployee?: Employee;
  receiptEmployeeId: number | null;
  receiptEmployee?: Employee;
  packagingEmployeeId: number | null;
  packagingEmployee?: Employee;
  shippingEmployeeId: number | null;
  shippingEmployee?: Employee;
  specifications?: OrderingToSpecification[];
  checks?: OrderingToCheck[];
  files?: FileEntity[];
}

export interface OrderingToSpecification {
  id: number;
  basic: string | null;
  significant: string | null;
  orderingId: number;
  specificationId: number;
  specification?: Specification;
  specificationDetailId: number | null;
  specificationDetail?: SpecificationDetail;
}

export interface OrderingToCheck {
  id: number;
  orderingId: number;
  checkItemDetailId: number;
  checkItemDetail?: CheckItemDetail;
  checkEmployeeId: number | null;
  checkEmployee?: Employee;
}

export interface OrderingCreateDto {
  customerName: string;
  siteName?: string;
  orderer?: string;
  customerContact?: string;
  orderDate?: string;
  dueDate?: string;
  orderNumber: string;
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
  l5?: string;
  l6?: string;
  quantity?: string;
  expectedDeliveryDate?: string;
  memo?: string;
  modelId: number;
  orderEmployeeId?: number;
  receiptEmployeeId?: number;
  packagingEmployeeId?: number;
  shippingEmployeeId?: number;
  specifications?: { specificationId: number; specificationDetailId?: number; basic?: string; significant?: string }[];
  checks?: { checkItemDetailId: number; checkEmployeeId?: number }[];
  fileIds?: number[];
}

export interface OrderingUpdateDto extends Partial<OrderingCreateDto> {
  version: number;
}

export interface OrderingFilter extends PaginationParams {
  status?: OrderStatus;
  customerName?: string;
  orderNumber?: string;
  modelId?: number;
  orderDateFrom?: string;
  orderDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

// ============================================================
// Order Form
// ============================================================

export interface OrderForm extends BaseEntity {
  dueDate: string | null;
  orderingTeam: OrderingTeam;
  orderOwner: string | null;
  orderer: string | null;
  customerContact: string | null;
  contact: string | null;
  orderNumber: string | null;
  customerName: string | null;
  siteName: string | null;
  orderDate: string | null;
  quantity: string | null;
  expectedDeliveryDate: string | null;
  memo: string | null;
  status: OrderStatus;
  orderingId: number | null;
  ordering?: Ordering;
  orderEmployeeId: number | null;
  receiptEmployeeId: number | null;
  assignedEmployees: OrderFormEmployee[];
  files?: FileEntity[];
}

export interface OrderFormEmployee {
  id: number;
  slot: string; // 'A' ~ 'P'
  employeeId: number;
  employee?: Employee;
  orderFormId: number;
}

export interface OrderFormCreateDto {
  dueDate?: string;
  orderingTeam: OrderingTeam;
  orderOwner?: string;
  orderer?: string;
  customerContact?: string;
  contact?: string;
  orderNumber?: string;
  customerName?: string;
  siteName?: string;
  orderDate?: string;
  quantity?: string;
  expectedDeliveryDate?: string;
  memo?: string;
  orderingId?: number;
  orderEmployeeId?: number;
  receiptEmployeeId?: number;
  assignedEmployees?: { slot: string; employeeId: number }[];
  fileIds?: number[];
}

export interface OrderFormFilter extends PaginationParams {
  status?: OrderStatus;
  customerName?: string;
  orderNumber?: string;
  orderingTeam?: OrderingTeam;
}

// ============================================================
// File
// ============================================================

export interface FileEntity {
  id: number;
  url: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  size: number;
  createdAt: string;
}

// ============================================================
// Admin
// ============================================================

export interface Admin extends BaseEntity {
  loginId: string;
  name: string;
  role: Role;
  isEnabled: boolean;
  lastLoginDate: string | null;
}

export interface AdminCreateDto {
  loginId: string;
  name: string;
  password: string;
  role: Role;
}

// ============================================================
// App Settings
// ============================================================

export interface AppSettings {
  id: number;
  defaultLocale: string;
  international: boolean;
  lastOrderNumber: number;
}
