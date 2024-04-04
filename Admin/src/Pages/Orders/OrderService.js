class OrderService {
  async getOrders() {
    try {
      const response = await fetch("http://localhost:3002/allOrders");
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
