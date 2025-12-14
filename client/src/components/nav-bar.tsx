import { Link, useLocation } from "wouter";
import { getUser, clearAuth } from "@/lib/auth";
import { Search, Camera, PlusSquare, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function NavBar() {
  const [, setLocation] = useLocation();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    setLocation("/login");
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-xl flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-home">
          <Camera className="w-7 h-7" />
          <span style={{ fontFamily: '"Architects Daughter", cursive' }}>InstaClone</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/search" className="text-foreground hover:text-primary transition-colors" title="Search" data-testid="link-search">
            <Search className="w-6 h-6" />
          </Link>
          <Link href="/create" className="text-foreground hover:text-primary transition-colors" title="New Post" data-testid="link-create">
            <PlusSquare className="w-6 h-6" />
          </Link>
          {user && (
            <Link href={`/profile/${user.username}`} className="hover:opacity-80 transition-opacity" title="My Profile" data-testid="link-my-profile">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-foreground hover:text-destructive transition-colors"
            title="Logout"
            data-testid="button-logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
