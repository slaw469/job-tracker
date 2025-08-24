// src/routes/router.tsx
import React, { lazy, Suspense, useEffect, useState } from "react";
import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../lib/firebaseAuth";
import RouteLoader from "../components/Loading/RouteLoader";
import { RootErrorBoundary } from "../components/ErrorBoundaries/RootErrorBoundary";

const DashboardLayout = lazy(() => import("./screens/dashboard/DashboardLayout"));
const CrmRoute = lazy(() => import("./screens/dashboard/CrmRoute"));
const SettingsRoute = lazy(() => import("./screens/dashboard/SettingsRoute"));
const UpgradeRoute = lazy(() => import("./screens/dashboard/UpgradeRoute"));
const ApplicationDetailRoute = lazy(() => import("./screens/dashboard/ApplicationDetailRoute"));
const AuthPage = lazy(() => import("../components/Auth/AuthPage").then((m) => ({ default: m.AuthPage })));
const OnboardingName = lazy(() => import("./screens/OnboardingName"));
const OnboardingWelcome = lazy(() => import("./screens/OnboardingWelcome"));
const NotFound = lazy(() => import("./screens/NotFound"));

export interface UserState {
  isAuthenticated: boolean;
  email?: string;
  hasName: boolean;
  onboardingComplete: boolean;
}

export async function getUserState(): Promise<UserState> {
  const { data } = await firebaseAuth.getSession();
  const session = data.session;
  if (!session) return { isAuthenticated: false, hasName: false, onboardingComplete: false };
  const email = session.user.email || undefined;
  const hasName = Boolean(session.user.user_metadata?.name);
  const onboardingComplete = (() => {
    try {
      const key = email ? `onboarding_complete:${email.toLowerCase()}` : undefined;
      return key ? localStorage.getItem(key) === "1" : false;
    } catch {
      return false;
    }
  })();
  return { isAuthenticated: true, email, hasName, onboardingComplete };
}

function RedirectToDashboardOrLogin() {
  const [path, setPath] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const state = await getUserState();
      if (mounted) setPath(state.isAuthenticated ? "/dashboard" : "/login");
    })();
    const { unsubscribe } = firebaseAuth.onAuthStateChange(async () => {
      const state = await getUserState();
      setPath(state.isAuthenticated ? "/dashboard" : "/login");
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);
  if (!path) return null;
  return <Navigate to={path} replace />;
}

function ProtectedRoute({
  children,
  requireOnboarding,
}: {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}) {
  const [dest, setDest] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const compute = async () => {
      const state = await getUserState();
      if (!mounted) return;
      if (!state.isAuthenticated) setDest("/login");
      else if (requireOnboarding) {
        if (!state.hasName) setDest("/onboarding/name-entry");
        else if (!state.onboardingComplete) setDest("/onboarding/welcome");
        else setDest(null);
      } else setDest(null);
      setReady(true);
    };
    compute();
    const { unsubscribe } = firebaseAuth.onAuthStateChange(() => compute());
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [requireOnboarding]);

  if (!ready) return null;
  if (dest) return <Navigate to={dest} replace />;
  return <>{children}</>;
}

function AuthPageWrapper({ defaultMode }: { defaultMode: "login" | "signup" }) {
  const navigate = useNavigate();
  useEffect(() => {
    // complete Google redirect if returning from OAuth
    firebaseAuth.resolveRedirectResult().then(() => {
      // noop, session guard will navigate
    });
  }, []);
  useEffect(() => {
    if (defaultMode === "signup") window.history.replaceState(null, "", "/signup");
  }, [defaultMode]);
  return <AuthPage onLogin={() => navigate("/dashboard", { replace: true })} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectToDashboardOrLogin />,
    errorElement: (
      <RootErrorBoundary>
        <RouteLoader />
      </RootErrorBoundary>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<RouteLoader />}>
        <AuthPageWrapper defaultMode="login" />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<RouteLoader />}>
        <AuthPageWrapper defaultMode="signup" />
      </Suspense>
    ),
  },
  {
    path: "/onboarding",
    children: [
      {
        path: "name-entry",
        element: (
          <ProtectedRoute requireOnboarding>
            <Suspense fallback={<RouteLoader />}>
              <OnboardingName />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "welcome",
        element: (
          <ProtectedRoute requireOnboarding>
            <Suspense fallback={<RouteLoader />}>
              <OnboardingWelcome />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard/*",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<RouteLoader />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard/crm" replace /> },
      { path: "crm", element: <Suspense fallback={<RouteLoader />}><CrmRoute /></Suspense> },
      { path: "settings", element: <Suspense fallback={<RouteLoader />}><SettingsRoute /></Suspense> },
      { path: "upgrade", element: <Suspense fallback={<RouteLoader />}><UpgradeRoute /></Suspense> },
      { path: "applications/:id", element: <Suspense fallback={<RouteLoader />}><ApplicationDetailRoute /></Suspense> },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<RouteLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
