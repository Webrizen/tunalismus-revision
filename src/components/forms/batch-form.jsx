"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function BatchForm({ batch, onClose, onBatchUpdated }) {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [trainer, setTrainer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedule, setSchedule] = useState("");
  const [students, setStudents] = useState([]);

  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (batch) {
      setName(batch.name);
      setCourse(batch.course._id);
      setTrainer(batch.trainer._id);
      setStartDate(new Date(batch.startDate).toISOString().split("T")[0]);
      setEndDate(new Date(batch.endDate).toISOString().split("T")[0]);
      setSchedule(batch.schedule);
      setStudents(batch.students.map((s) => s._id));
    }
  }, [batch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [coursesRes, usersRes] = await Promise.all([
          fetch("/api/courses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const { courses } = await coursesRes.json();
        const { users } = await usersRes.json();

        setCourses(courses);
        setTrainers(users.filter((u) => u.role === "trainer"));
        setAllStudents(users.filter((u) => u.role === "student"));
      } catch (error) {
        setError("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const batchData = {
      name,
      course,
      trainer,
      startDate,
      endDate,
      schedule,
      students,
    };

    try {
      const token = localStorage.getItem("token");
      const url = batch ? `/api/batches/${batch._id}` : "/api/batches";
      const method = batch ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(batchData),
      });

      if (res.ok) {
        onBatchUpdated();
        onClose();
      } else {
        const { message } = await res.json();
        setError(message || "Failed to save batch.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields for name, course, trainer, dates, schedule */}
      {/* ... (similar to CourseForm) ... */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="course"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Course
        </label>
        <select
          id="course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="trainer"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Trainer
        </label>
        <select
          id="trainer"
          value={trainer}
          onChange={(e) => setTrainer(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a trainer</option>
          {trainers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Start Date
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          End Date
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="schedule"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Schedule
        </label>
        <input
          id="schedule"
          type="text"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="e.g. Mon-Wed-Fri 6PM"
          className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="students"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Students
        </label>
        <select
          id="students"
          multiple
          value={students}
          onChange={(e) =>
            setStudents(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          className="w-full h-32 px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {allStudents.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
