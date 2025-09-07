import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BatchOverview({ batch }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Batch Overview</h2>
      <Card>
        <CardHeader>
          <CardTitle>{batch.course.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <p><span className="font-semibold">Level:</span> {batch.course.level}</p>
          <p><span className="font-semibold">Duration:</span> {batch.course.durationWeeks} weeks</p>
          <p><span className="font-semibold">Schedule:</span> {batch.schedule || "Not specified"}</p>
          <p><span className="font-semibold">Dates:</span> {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground pt-2">{batch.course.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
