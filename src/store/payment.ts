import { defineStore } from "pinia";
import { getAPI, patchAPI } from "../utils/api";
import type { Payment } from "../types/payment";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    payments: null as Payment | null,
  }),
  actions: {
    async fetchPaymentByContract(contractId:string) {
      try {
        const response = await getAPI<Payment>(`/payment/contract/${contractId}`);
        this.payments = response.data;
      } catch (error) {
        throw new Error("Failed to fetch payment");
      }
    },

    async releasePayment(paymentId:string){
        try {
        await patchAPI(`/payment/${paymentId}/client/release`, null);
      } catch (error) {
        throw new Error("Failed to release payment");
      }
    }
  },
});
