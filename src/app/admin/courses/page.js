"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import CourseForm from "@/components/forms/course-form";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const { courses } = await res.json();
        setCourses(courses);
      } else {
        const { message } = await res.json();
        setError(message || "Failed to fetch courses.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/courses/${selectedCourse._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCourses();
        setIsDeleteModalOpen(false);
        setSelectedCourse(null);
      } else {
        const { message } = await res.json();
        setError(message || "Failed to delete course.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  const handleCourseUpdated = () => {
    fetchCourses();
  };

  if (loading && courses.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <div className="mt-4 w-full h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Button onClick={handleCreate}>Create Course</Button>
      </div>
      <div className="mt-4">
        <table className="w-full text-left bg-white rounded-lg shadow-md dark:bg-gray-800">
          <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Level</th>
              <th className="px-6 py-3">Duration (Weeks)</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b dark:border-gray-700">
                <td className="px-6 py-4">{course.title}</td>
                <td className="px-6 py-4">{course.level}</td>
                <td className="px-6 py-4">{course.durationWeeks}</td>
                <td className="px-6 py-4">{course.price}</td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(course)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCourse ? "Edit Course" : "Create Course"}
      >
        <CourseForm
          course={selectedCourse}
          onClose={() => setIsModalOpen(false)}
          onCourseUpdated={handleCourseUpdated}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div>
          <p>Are you sure you want to delete this course?</p>
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
