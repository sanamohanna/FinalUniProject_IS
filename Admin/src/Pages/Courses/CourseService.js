class CourseService {
  async getCourses() {
    try {
      const response = await fetch("http://localhost:3002/Courses");
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

export const courseService = new CourseService();
