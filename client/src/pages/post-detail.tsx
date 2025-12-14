import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { apiRequest } from "@/lib/api";
import { PostWithDetails, CommentWithUser } from "@shared/schema";
import NavBar from "@/components/nav-bar";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading: postLoading, error: postError } = useQuery<PostWithDetails>({
    queryKey: ["/api/posts", id],
    queryFn: () => apiRequest<PostWithDetails>("GET", `/api/posts/${id}`),
  });

  const { data: comments, isLoading: commentsLoading } = useQuery<CommentWithUser[]>({
    queryKey: ["/api/posts", id, "comments"],
    queryFn: () => apiRequest<CommentWithUser[]>("GET", `/api/posts/${id}/comments`),
  });

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/posts/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/posts/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/posts/${id}/comments`, { text: commentText }),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
    },
  });

  const handleLikeToggle = () => {
    if (post?.isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate();
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-xl mx-auto p-4">
          <p className="text-muted-foreground" data-testid="text-loading">Loading post...</p>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-xl mx-auto p-4">
          <p className="text-destructive" data-testid="text-error">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-xl mx-auto p-4">
        <div className="border border-border rounded-md overflow-hidden mb-4">
          <div className="p-3 border-b border-border">
            <Link href={`/profile/${post.username}`} className="font-semibold" data-testid="link-post-author">
              @{post.username}
            </Link>
            <span className="text-muted-foreground text-sm ml-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full"
            data-testid="img-post"
          />
          <div className="p-3">
            <div className="flex gap-4 mb-2">
              <button
                onClick={handleLikeToggle}
                disabled={likeMutation.isPending || unlikeMutation.isPending}
                className="text-sm"
                data-testid="button-like"
              >
                {post.isLiked ? "Unlike" : "Like"} ({post.likeCount})
              </button>
              <span className="text-sm text-muted-foreground" data-testid="text-comment-count">
                {post.commentCount} comments
              </span>
            </div>
            {post.caption && (
              <p className="text-sm" data-testid="text-caption">
                <span className="font-semibold">@{post.username}</span> {post.caption}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              maxLength={300}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
              data-testid="input-comment"
            />
            <button
              type="submit"
              disabled={commentMutation.isPending || !commentText.trim()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
              data-testid="button-add-comment"
            >
              Post
            </button>
          </form>

          {commentsLoading ? (
            <p className="text-muted-foreground text-sm">Loading comments...</p>
          ) : comments && comments.length === 0 ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-comments">No comments yet</p>
          ) : (
            <div className="space-y-3">
              {comments?.map((comment) => (
                <div key={comment.id} className="text-sm" data-testid={`comment-${comment.id}`}>
                  <Link href={`/profile/${comment.username}`} className="font-semibold">
                    @{comment.username}
                  </Link>
                  <span className="ml-2">{comment.text}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
