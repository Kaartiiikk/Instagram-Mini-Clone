import { Link } from "wouter";
import { PostWithDetails } from "@shared/schema";

interface PostCardProps {
  post: PostWithDetails;
  onLikeToggle: (postId: string, isLiked: boolean) => void;
  showLink?: boolean;
}

export default function PostCard({ post, onLikeToggle, showLink }: PostCardProps) {
  return (
    <div className="border border-border rounded-md overflow-hidden" data-testid={`post-card-${post.id}`}>
      <div className="p-3 border-b border-border flex items-center justify-between gap-2">
        <Link href={`/profile/${post.username}`} className="font-semibold text-sm" data-testid={`link-author-${post.id}`}>
          @{post.username}
        </Link>
        <span className="text-muted-foreground text-xs">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      <img
        src={post.imageUrl}
        alt="Post"
        className="w-full"
        data-testid={`img-post-${post.id}`}
      />
      <div className="p-3">
        <div className="flex gap-4 mb-2">
          <button
            onClick={() => onLikeToggle(post.id, post.isLiked)}
            className="text-sm"
            data-testid={`button-like-${post.id}`}
          >
            {post.isLiked ? "Unlike" : "Like"} ({post.likeCount})
          </button>
          {showLink ? (
            <Link href={`/post/${post.id}`} className="text-sm text-muted-foreground" data-testid={`link-comments-${post.id}`}>
              {post.commentCount} comments
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">
              {post.commentCount} comments
            </span>
          )}
        </div>
        {post.caption && (
          <p className="text-sm" data-testid={`text-caption-${post.id}`}>
            <span className="font-semibold">@{post.username}</span> {post.caption}
          </p>
        )}
      </div>
    </div>
  );
}
