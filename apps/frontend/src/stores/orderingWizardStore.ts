import { create } from 'zustand';
import type { Model, OrderingCreateDto } from '@dhs/shared';

interface OrderingSpec {
  specificationId: number;
  specificationDetailId?: number;
  basic?: string;
  significant?: string;
}

interface OrderingCheck {
  checkItemDetailId: number;
  checkEmployeeId?: number;
}

interface OrderingWizardState {
  currentStep: number;
  selectedModel: Model | null;
  selectedSpecs: OrderingSpec[];
  selectedChecks: OrderingCheck[];
  formData: Partial<OrderingCreateDto>;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setModel: (model: Model) => void;
  setSpecs: (specs: OrderingSpec[]) => void;
  setChecks: (checks: OrderingCheck[]) => void;
  setFormData: (data: Partial<OrderingCreateDto>) => void;
  reset: () => void;
  buildCreateDto: () => OrderingCreateDto;
}

export const useOrderingWizardStore = create<OrderingWizardState>((set, get) => ({
  currentStep: 0,
  selectedModel: null,
  selectedSpecs: [],
  selectedChecks: [],
  formData: {},

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  setModel: (model) => set({ selectedModel: model, selectedSpecs: [], selectedChecks: [] }),
  setSpecs: (specs) => set({ selectedSpecs: specs }),
  setChecks: (checks) => set({ selectedChecks: checks }),
  setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
  reset: () =>
    set({
      currentStep: 0,
      selectedModel: null,
      selectedSpecs: [],
      selectedChecks: [],
      formData: {},
    }),

  buildCreateDto: () => {
    const { selectedModel, selectedSpecs, selectedChecks, formData } = get();
    return {
      ...formData,
      modelId: selectedModel?.id ?? 0,
      customerName: formData.customerName ?? '',
      orderNumber: formData.orderNumber ?? '',
      specifications: selectedSpecs,
      checks: selectedChecks,
    } as OrderingCreateDto;
  },
}));
