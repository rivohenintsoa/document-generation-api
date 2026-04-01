export const batchRepository = {
  async create() {
    return {
      id: "mock-batch-id",
      status: "pending",
    };
  },

  async findById(id: string) {
    return {
      id,
      status: "pending",
    };
  },
};