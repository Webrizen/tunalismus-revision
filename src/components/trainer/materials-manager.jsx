"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Upload } from "lucide-react";

// A simple form for uploading a new material
function MaterialUploadForm({ courseId, onUploadSuccess }) {
  // In a real app, this would be a proper form with validation
  // and likely a file upload handler that uploads to a cloud storage service
  // and returns a URL. For now, we'll just use a text input for the URL.
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [type, setType] = useState("pdf");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/materials/course/${courseId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, fileUrl, type }),
    });
    if (res.ok) {
      onUploadSuccess();
    } else {
      alert("Failed to upload material.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <input className="border p-2 rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <input className="border p-2 rounded" placeholder="File URL" value={fileUrl} onChange={e => setFileUrl(e.target.value)} required />
      <select className="border p-2 rounded" value={type} onChange={e => setType(e.target.value)}>
        <option value="pdf">PDF</option>
        <option value="video">Video</option>
        <option value="doc">Doc</option>
        <option value="link">Link</option>
      </select>
      <Button type="submit">Upload</Button>
    </form>
  );
}


export default function MaterialsManager({ courseId }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/materials/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { materials } = await res.json();
        setMaterials(materials);
      } else {
        setError("Failed to fetch materials.");
      }
    } catch (e) {
      setError("An error occurred while fetching materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const handleDelete = async (materialId) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/materials/${materialId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      fetchMaterials(); // Refresh list
    } else {
      alert("Failed to delete material.");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (loading) return <p>Loading materials...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Course Materials</h2>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Material</DialogTitle>
            </DialogHeader>
            <MaterialUploadForm courseId={courseId} onUploadSuccess={() => {
              setIsUploadModalOpen(false);
              fetchMaterials();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {materials.map(material => (
          <div key={material._id} className="flex items-center justify-between p-3 border rounded-lg">
            <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              {material.title} <span className="text-xs text-muted-foreground ml-2">({material.type})</span>
            </a>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(material._id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
      {materials.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">No materials have been uploaded for this course yet.</p>
      )}
    </div>
  );
}
