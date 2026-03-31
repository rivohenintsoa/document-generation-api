import { batchRepository } from "../repositories/batch.repository";
export const batchService = {
  async create() {
    return batchRepository.create();
  },

  async getById(id: string) {
    return batchRepository.findById(id);
  },
};