"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BatchOverview from "@/components/trainer/batch-overview";
import StudentList from "@/components/trainer/student-list";
import AttendanceTracker from "@/components/trainer/attendance-tracker";
import MaterialsManager from "@/components/trainer/materials-manager";


export default function BatchDetailPage() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!batchId) return;
    const fetchBatchDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/trainer/batches/${batchId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const { batch } = await res.json();
          setBatch(batch);
        } else {
          const { message } = await res.json();
          setError(message || "Failed to fetch batch details.");
        }
      } catch (error) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatchDetails();
  }, [batchId]);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Error</h1>
        <p className="mt-4 text-red-600">{error}</p>
        <Link href="/trainer/batches" className="mt-4 inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Batches
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/trainer/batches" className="mb-4 inline-flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Batches
      </Link>
      <h1 className="text-3xl font-bold mb-2">{batch.name}</h1>
      <p className="text-lg text-muted-foreground mb-6">{batch.course.title}</p>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <BatchOverview batch={batch} />
        </TabsContent>
        <TabsContent value="students" className="mt-4">
          <StudentList students={batch.students} />
        </TabsContent>
        <TabsContent value="attendance" className="mt-4">
          <AttendanceTracker batch={batch} />
        </TabsContent>
        <TabsContent value="materials" className="mt-4">
          <MaterialsManager courseId={batch.course._id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
