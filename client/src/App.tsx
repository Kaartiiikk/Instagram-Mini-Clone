import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isAuthenticated } from "@/lib/auth";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Feed from "@/pages/feed";
import Profile from "@/pages/profile";
import CreatePost from "@/pages/create-post";
import PostDetail from "@/pages/post-detail";
import NotFound from "@/pages/not-found";

import Search from "@/pages/search";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }
  return <Component />;
}

function AuthRoute({ component: Component }: { component: React.ComponentType }) {
  if (isAuthenticated()) {
    return <Redirect to="/" />;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <AuthRoute component={Login} />
      </Route>
      <Route path="/signup">
        <AuthRoute component={Signup} />
      </Route>
      <Route path="/">
        <ProtectedRoute component={Feed} />
      </Route>
      <Route path="/search">
        <ProtectedRoute component={Search} />
      </Route>
      <Route path="/profile/:username">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/create">
        <ProtectedRoute component={CreatePost} />
      </Route>
      <Route path="/post/:id">
        <ProtectedRoute component={PostDetail} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
