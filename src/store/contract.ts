// src/store/contract.ts
import { defineStore } from "pinia";
import { getAPI, postAPI } from "../utils/api";
import type { ContractCreate } from "../types/contract";
import type { Contract } from "../types/contract";

export const useContractsStore = defineStore("contracts", {
  state: () => ({
    contracts: [] as Contract[],
    contract: null as Contract | null,
    loading: false,
    error: null,
  }),
  actions: {
    async createContract(contract: ContractCreate) {
      this.loading = true;
      try {
        await postAPI("/contract/client", contract);
      } catch (error: any) {
        this.error = error?.message;
        throw new Error("Failed to create contract");
      } finally {
        this.loading = false;
      }
    },

    async fetchContractByClient(userId: string) {
      this.loading = true;
      try {
        const response = await getAPI<Contract[]>(`/contract/client/${userId}`);
        this.contracts = response.data;
      } catch (error: any) {
        this.error = error.message;
        throw new Error("Failed to fetch contracts by client");
      } finally {
        this.loading = false;
      }
    },

    async fetchContractByFreelancer(userId: string) {
      this.loading = true;
      try {
        const response = await getAPI<Contract[]>(`/contract/freelancer/${userId}`);
        this.contracts = response.data;
      } catch (error: any) {
        this.error = error.message;
        throw new Error("Failed to fetch contracts by freelancer");
      } finally {
        this.loading = false;
      }
    },

    async fetchFreelancerContractById(userId: string, contractId: string) {
      this.loading = true;
      try {
        const response = await getAPI<Contract>(`/contract/${contractId}/freelancer/${userId}`);
        this.contract = response.data;
      } catch (error: any) {
        this.error = error.message;
        throw new Error("Failed to fetch contract by freelancer");
      } finally {
        this.loading = false;
      }
    },

    async fetchClientContractById(userId: string, contractId: string) {
      this.loading = true;
      try {
        const response = await getAPI<Contract>(`/contract/${contractId}/client/${userId}`);
        this.contract = response.data;
      } catch (error: any) {
        this.error = error.message;
        throw new Error("Failed to fetch contract by client");
      } finally {
        this.loading = false;
      }
    },
  },
});
