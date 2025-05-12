// src/store/contract.ts
import { defineStore } from "pinia";
import { getAPI, postAPI } from "../utils/api";
import type { ContractCreate } from "../types/contract";
import type { Contract } from "../types/bid";

export const useContractsStore = defineStore("contracts", {
  state: () => ({
    contracts: [] as Contract[],
  }),
  actions: {
    async createContract(contract: ContractCreate) {
      try {
        await postAPI("/contract/client", contract);
      } catch (error) {
        throw new Error("Failed to create contract");
      }
    },

    async findContractByClient(userId: string) {
      try {
        const response = await getAPI<Contract[]>(`/contract/client/${userId}`);
        this.contracts = response.data;
      } catch (error) {
        throw new Error("Failed to create contract");
      }
    },

    async findContractByFreelancer(userId: string) {
      try {
        const response = await getAPI<Contract[]>(`/contract/freelancer/${userId}`);
        this.contracts = response.data;
      } catch (error) {
        throw new Error("Failed to create contract");
      }
    },
  },
});
