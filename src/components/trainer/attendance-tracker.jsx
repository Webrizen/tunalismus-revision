"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to get dates for the last 30 days
function getLast30Days() {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  return dates.reverse();
}

export default function AttendanceTracker({ batch }) {
  const [attendance, setAttendance] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDates(getLast30Days());

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/attendance/batch/${batch._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { attendance: fetchedAttendance } = await res.json();
          // Process data into a map for easy lookup: { "studentId-dateString": status }
          const attendanceMap = fetchedAttendance.reduce((acc, record) => {
            const dateString = new Date(record.date).toISOString().split('T')[0];
            acc[`${record.student._id}-${dateString}`] = record.status;
            return acc;
          }, {});
          setAttendance(attendanceMap);
        } else {
          setError("Failed to fetch attendance data.");
        }
      } catch (e) {
        setError("An error occurred while fetching attendance.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [batch._id]);

  const handleStatusChange = async (studentId, date, status) => {
    const dateString = date.toISOString().split('T')[0];
    const originalStatus = attendance[`${studentId}-${dateString}`];

    // Optimistically update UI
    setAttendance(prev => ({ ...prev, [`${studentId}-${dateString}`]: status }));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/attendance/batch/${batch._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId, date: dateString, status }),
      });

      if (!res.ok) {
        // Revert on failure
        setAttendance(prev => ({ ...prev, [`${studentId}-${dateString}`]: originalStatus }));
        alert("Failed to update attendance.");
      }
    } catch (e) {
      // Revert on failure
      setAttendance(prev => ({ ...prev, [`${studentId}-${dateString}`]: originalStatus }));
      alert("An error occurred while updating attendance.");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Attendance Tracker</h2>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background">Student</TableHead>
              {dates.map(date => (
                <TableHead key={date.toISOString()} className="text-center">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeletons for loading state
              Array.from({ length: batch.students.length }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="sticky left-0 bg-background"><Skeleton className="h-5 w-32" /></TableCell>
                  {dates.map(date => <TableCell key={date.toISOString()}><Skeleton className="h-8 w-24 mx-auto" /></TableCell>)}
                </TableRow>
              ))
            ) : (
              batch.students.map(student => (
                <TableRow key={student._id}>
                  <TableCell className="font-medium sticky left-0 bg-background">{student.name}</TableCell>
                  {dates.map(date => {
                    const dateString = date.toISOString().split('T')[0];
                    const status = attendance[`${student._id}-${dateString}`] || 'Absent';
                    return (
                      <TableCell key={date.toISOString()}>
                        <Select
                          value={status}
                          onValueChange={(newStatus) => handleStatusChange(student._id, date, newStatus)}
                        >
                          <SelectTrigger className="w-28 mx-auto">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Late">Late</SelectItem>
                            <SelectItem value="Excused">Excused</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
