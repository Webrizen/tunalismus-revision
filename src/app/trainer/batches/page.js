"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function BatchCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardContent>
    </Card>
  );
}

export default function MyBatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/trainer/batches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const { batches } = await res.json();
          setBatches(batches);
        } else {
          const { message } = await res.json();
          setError(message || "Failed to fetch batches.");
        }
      } catch (error) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">My Batches</h1>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">My Batches</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <BatchCardSkeleton key={i} />
            ))
          : batches.map((batch) => (
              <Link href={`/trainer/batches/${batch._id}`} key={batch._id}>
                <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
                  <CardHeader>
                    <CardTitle>{batch.name}</CardTitle>
                    <CardDescription>{batch.course.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Level: {batch.course.level}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dates: {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
      {!loading && batches.length === 0 && (
        <div className="mt-6 text-center text-muted-foreground">
          <p>You are not assigned to any batches.</p>
        </div>
      )}
    </div>
  );
}
