import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { UserProfile, PostWithDetails } from "@shared/schema";
import PostCard from "@/components/post-card";
import NavBar from "@/components/nav-bar";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const queryClient = useQueryClient();
  const currentUser = getUser();
  const isOwnProfile = currentUser?.username === username;

  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ["/api/users", username],
    queryFn: () => apiRequest<UserProfile>("GET", `/api/users/${username}`),
  });

  const followMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/users/${username}/follow`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", username] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/users/${username}/follow`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", username] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("POST", `/api/posts/${postId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", username] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("DELETE", `/api/posts/${postId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", username] });
    },
  });

  const handleFollowToggle = () => {
    if (profile?.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

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
          <p className="text-muted-foreground" data-testid="text-loading">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="max-w-xl mx-auto p-4">
          <p className="text-destructive" data-testid="text-error">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-xl mx-auto p-4">
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-xl font-bold" data-testid="text-profile-username">@{profile.username}</h1>
            {!isOwnProfile && (
              <button
                onClick={handleFollowToggle}
                disabled={followMutation.isPending || unfollowMutation.isPending}
                className="px-4 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                data-testid="button-follow"
              >
                {profile.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          <div className="flex gap-6 text-sm">
            <span data-testid="text-post-count"><strong>{profile.postCount}</strong> posts</span>
            <span data-testid="text-follower-count"><strong>{profile.followerCount}</strong> followers</span>
            <span data-testid="text-following-count"><strong>{profile.followingCount}</strong> following</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        {profile.posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4" data-testid="text-no-posts">No posts yet</p>
        ) : (
          <div className="space-y-4">
            {profile.posts.map((post) => (
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
