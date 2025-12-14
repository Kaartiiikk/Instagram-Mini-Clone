import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/api";
import NavBar from "@/components/nav-bar";
import { Search as SearchIcon } from "lucide-react";

interface SearchResult {
    id: string;
    username: string;
    postCount: number;
    followerCount: number;
}

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: users, isLoading } = useQuery<SearchResult[]>({
        queryKey: ["/api/search", searchQuery],
        queryFn: () => apiRequest<SearchResult[]>("GET", `/api/search?q=${encodeURIComponent(searchQuery)}`),
        enabled: searchQuery.length > 0,
    });

    return (
        <div className="min-h-screen bg-background">
            <NavBar />
            <div className="max-w-xl mx-auto p-4">
                <h1 className="text-xl font-bold mb-4">Search Users</h1>

                <div className="relative mb-6">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for users..."
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
                        data-testid="input-search"
                    />
                </div>

                {searchQuery.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Start typing to search for users</p>
                    </div>
                ) : isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Searching...</p>
                    </div>
                ) : users && users.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No users found</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {users?.map((user) => (
                            <Link
                                key={user.id}
                                href={`/profile/${user.username}`}
                                className="block p-4 border border-border rounded-md hover:bg-muted transition-colors"
                                data-testid={`search-result-${user.username}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">@{user.username}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.postCount} posts · {user.followerCount} followers
                                        </p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">View →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
