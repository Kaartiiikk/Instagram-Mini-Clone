import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Post } from "@shared/schema";
import NavBar from "@/components/nav-bar";

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: () => apiRequest<Post>("POST", "/api/posts", { imageUrl, caption }),
    onSuccess: () => {
      setLocation("/");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4" data-testid="text-create-title">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              data-testid="input-image-url"
              required
            />
          </div>
          {imageUrl && (
            <div className="border border-border rounded-md overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-64 object-contain bg-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                data-testid="img-preview"
              />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
              data-testid="input-caption"
            />
            <p className="text-xs text-muted-foreground mt-1">{caption.length}/500</p>
          </div>
          {error && <p className="text-destructive text-sm" data-testid="text-error">{error}</p>}
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-2 bg-secondary text-secondary-foreground rounded-md"
            data-testid="button-create-post"
          >
            {createMutation.isPending ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
