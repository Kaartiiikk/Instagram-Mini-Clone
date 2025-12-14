import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { PostWithDetails } from "@shared/schema";
import PostCard from "@/components/post-card";
import NavBar from "@/components/nav-bar";

export default function Feed() {
  const queryClient = useQueryClient();
  const user = getUser();

  const { data: posts, isLoading, error } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/feed"],
    queryFn: () => apiRequest<PostWithDetails[]>("GET", "/api/feed"),
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("POST", `/api/posts/${postId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("DELETE", `/api/posts/${postId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
    },
  });

  const handleLikeToggle = (postId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate(postId);
    } else {
      likeMutation.mutate(postId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-xl mx-auto p-4">
          <p className="text-muted-foreground" data-testid="text-loading">Loading feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-xl mx-auto p-4">
          <p className="text-destructive" data-testid="text-error">Error loading feed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4" data-testid="text-feed-title">Home Feed</h1>
        {posts && posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2" data-testid="text-empty-feed">No posts yet</p>
            <p className="text-sm text-muted-foreground">Follow some users to see their posts here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts?.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
                showLink
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
