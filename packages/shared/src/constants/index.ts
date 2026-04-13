import {
  Position,
  JobGroup,
  Headquarter,
  Department,
  EmploymentStatus,
  Gender,
  OrderingTeam,
  Role,
  OrderStatus,
} from '../types';

// ============================================================
// Label Maps (한국어)
// ============================================================

export const POSITION_LABELS: Record<Position, string> = {
  [Position.A_CEO]: '대표이사',
  [Position.B_VICE_CEO]: '부사장',
  [Position.C_EXECUTIVE]: '전무',
  [Position.D_GENERAL_MANAGER]: '부장',
  [Position.E_DEPUTY_MANAGER]: '차장',
  [Position.F_MANAGER]: '과장',
  [Position.G_ASSISTANT_MANAGER]: '대리',
  [Position.H_SENIOR_STAFF]: '주임',
  [Position.I_STAFF]: '사원',
};

export const JOB_GROUP_LABELS: Record<JobGroup, string> = {
  [JobGroup.C_LEVEL]: '경영진',
  [JobGroup.MANAGEMENT]: '경영지원',
  [JobGroup.RESEARCH_CENTER]: '연구소',
  [JobGroup.SALES]: '영업',
  [JobGroup.PRODUCTION]: '생산',
};

export const HEADQUARTER_LABELS: Record<Headquarter, string> = {
  [Headquarter.DAEHYUN_SENSOR]: '대현센서',
  [Headquarter.PRODUCT_DIVISION]: '제품사업부',
  [Headquarter.RESEARCH_CENTER]: '연구소',
  [Headquarter.ADMIN_DIVISION]: '관리본부',
  [Headquarter.SALES_DIVISION]: '영업본부',
};

export const DEPARTMENT_LABELS: Record<Department, string> = {
  [Department.DHS]: 'DHS',
  [Department.ADMIN_SUPPORT]: '경영지원',
  [Department.RESEARCH_CENTER]: '연구소',
  [Department.MARKETING]: '마케팅',
  [Department.SENSOR]: '센서',
  [Department.UNIT]: '유닛',
  [Department.PURCHASING]: '구매',
  [Department.SALES]: '영업',
  [Department.SALES_DIV1]: '영업1팀',
  [Department.SALES_DIV2]: '영업2팀',
  [Department.DLF]: 'DLF',
  [Department.A_S]: 'A/S',
  [Department.PROJECT_SALES]: '프로젝트영업',
  [Department.GLOBAL_SALES]: '해외영업',
  [Department.ACCOUNTING]: '회계',
  [Department.PACKAGING]: '포장',
  [Department.PRODUCT]: '생산',
  [Department.MACHINING]: '가공',
};

export const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  [EmploymentStatus.ACTIVE]: '재직',
  [EmploymentStatus.LEAVE]: '휴직',
  [EmploymentStatus.RETIRED]: '퇴직',
};

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: '남',
  [Gender.FEMALE]: '여',
};

export const ORDERING_TEAM_LABELS: Record<OrderingTeam, string> = {
  [OrderingTeam.SENSOR]: '센서',
  [OrderingTeam.UNIT]: '유닛',
  [OrderingTeam.DLF]: 'DLF',
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER]: '최고관리자',
  [Role.ADMIN]: '관리자',
  [Role.PRODUCTION]: '생산',
  [Role.USER]: '일반',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.ACTIVE]: '진행중',
  [OrderStatus.COMPLETED]: '완료',
  [OrderStatus.DELETED]: '삭제',
};

// ============================================================
// Enum to Select Options
// ============================================================

export function enumToOptions<T extends string>(
  enumObj: Record<string, T>,
  labels: Record<T, string>,
): { label: string; value: T }[] {
  return Object.values(enumObj).map((value) => ({
    label: labels[value],
    value,
  }));
}
