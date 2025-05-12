// src/store/contract.ts
import { defineStore } from "pinia";
import { getAPI, postAPI } from "../utils/api";
import type { ContractCreate } from "../types/contract";
import type { Contract } from "../types/bid";

export const useContractsStore = defineStore("contracts", {
  state: () => ({
    contracts: [] as Contract[],
    loading: false,
  }),
  actions: {
    async createContract(contract: ContractCreate) {
      this.loading = true;
      try {
        await postAPI("/contract/client", contract);
      } catch (error) {
        throw new Error("Failed to create contract");
      } finally {
        this.loading = false;
      }
    },

    async findContractByClient(userId: string) {
      this.loading = true;
      try {
        const response = await getAPI<Contract[]>(`/contract/client/${userId}`);
        this.contracts = response.data;
      } catch (error) {
        throw new Error("Failed to fetch contracts by client");
      } finally {
        this.loading = false;
      }
    },

    async findContractByFreelancer(userId: string) {
      this.loading = true;
      try {
        const response = await getAPI<Contract[]>(
          `/contract/freelancer/${userId}`
        );
        this.contracts = response.data;
      } catch (error) {
        throw new Error("Failed to fetch contracts by freelancer");
      } finally {
        this.loading = false;
      }
    },
  },
});
