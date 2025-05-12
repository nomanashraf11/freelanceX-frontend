import { defineStore } from "pinia";
import { getAPI, patchAPI } from "../utils/api";
import type { Payment } from "../types/payment";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    payments: null as Payment | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPaymentByContract(contractId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAPI<Payment>(`/payment/contract/${contractId}`);
        this.payments = response.data;
      } catch (error: any) {
        this.error = error.message;
        throw new Error("Failed to fetch payment");
      } finally {
        this.loading = false;
      }
    },

    async releasePayment(paymentId: string) {
      this.loading = true;
      this.error = null;
      try {
        await patchAPI(`/payment/${paymentId}/client/release`, null);
      } catch (error: any) {
        this.error = error.message;
        throw new Error("Failed to release payment");
      } finally {
        this.loading = false;
      }
    },
  },
});