import { Link, useLocation } from "wouter";
import { getUser, clearAuth } from "@/lib/auth";

export default function NavBar() {
  const [, setLocation] = useLocation();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    setLocation("/login");
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <Link href="/" className="font-bold text-lg" data-testid="link-home">
          Mini-Instagram
        </Link>
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/create" className="text-sm" data-testid="link-create">
            New Post
          </Link>
          {user && (
            <Link href={`/profile/${user.username}`} className="text-sm" data-testid="link-my-profile">
              @{user.username}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground"
            data-testid="button-logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
