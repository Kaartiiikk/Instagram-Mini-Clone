import { Link } from "wouter";
import { PostWithDetails } from "@shared/schema";
import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PostCardProps {
  post: PostWithDetails;
  onLikeToggle: (postId: string, isLiked: boolean) => void;
  showLink?: boolean;
}

export default function PostCard({ post, onLikeToggle, showLink }: PostCardProps) {
  return (
    <div className="border border-border rounded-md overflow-hidden" data-testid={`post-card-${post.id}`}>
      <div className="p-3 border-b border-border flex items-center gap-3">
        <Link href={`/profile/${post.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.avatarUrl} alt={post.username} />
            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/profile/${post.username}`} className="font-semibold text-sm" data-testid={`link-author-${post.id}`}>
          @{post.username}
        </Link>
        <div className="flex-1" />
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
            className={`text-sm flex items-center gap-1 transition-colors ${post.isLiked ? "text-red-500" : ""
              }`}
            data-testid={`button-like-${post.id}`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
            <span>{post.likeCount}</span>
          </button>
          {showLink ? (
            <Link href={`/post/${post.id}`} className="text-sm text-muted-foreground flex items-center gap-1" data-testid={`link-comments-${post.id}`}>
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentCount}</span>
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentCount}</span>
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
