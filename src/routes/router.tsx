import { createBrowserRouter, Navigate } from 'react-router-dom';
import React, { lazy } from 'react';
import { supabase } from '../lib/supabase';
import RouteLoader from '../components/Loading/RouteLoader';
import { RootErrorBoundary } from '../components/ErrorBoundaries/RootErrorBoundary';
const DashboardLayout = lazy(() => import('./screens/dashboard/DashboardLayout'));
const CrmRoute = lazy(() => import('./screens/dashboard/CrmRoute'));
const SettingsRoute = lazy(() => import('./screens/dashboard/SettingsRoute'));
const UpgradeRoute = lazy(() => import('./screens/dashboard/UpgradeRoute'));
const ApplicationDetailRoute = lazy(() => import('./screens/dashboard/ApplicationDetailRoute'));

// Lazy pages/components
const AppDashboard = lazy(() => import('../App'));
const AuthPage = lazy(() => import('../components/Auth/AuthPage'));
const OnboardingName = lazy(() => import('../routes/screens/OnboardingName'));
const OnboardingWelcome = lazy(() => import('../routes/screens/OnboardingWelcome'));
const NotFound = lazy(() => import('../routes/screens/NotFound'));

export interface UserState {
  isAuthenticated: boolean;
  email?: string;
  hasName: boolean;
  onboardingComplete: boolean;
}

export async function getUserState(): Promise<UserState> {
  if (!supabase) return { isAuthenticated: false, hasName: false, onboardingComplete: false };
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) return { isAuthenticated: false, hasName: false, onboardingComplete: false };
  const email = session.user.email || undefined;
  const hasName = Boolean((session.user.user_metadata as any)?.name);
  const onboardingComplete = (() => {
    try {
      const key = email ? `onboarding_complete:${email.toLowerCase()}` : undefined;
      return key ? localStorage.getItem(key) === '1' : false;
    } catch {
      return false;
    }
  })();
  return { isAuthenticated: true, email, hasName, onboardingComplete };
}

function RedirectToDashboardOrLogin() {
  const [path, setPath] = React.useState<string | null>(null);
  React.useEffect(() => {
    (async () => {
      const state = await getUserState();
      setPath(state.isAuthenticated ? '/dashboard' : '/login');
    })();
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
  const [dest, setDest] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const state = await getUserState();
      if (!state.isAuthenticated) {
        setDest(`/login`);
      } else if (requireOnboarding) {
        if (!state.hasName) setDest('/onboarding/name-entry');
        else if (!state.onboardingComplete) setDest('/onboarding/welcome');
        else setDest(null);
      } else {
        setDest(null);
      }
      setReady(true);
    })();
  }, [requireOnboarding]);
  if (!ready) return null;
  if (dest) return <Navigate to={dest} replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RedirectToDashboardOrLogin />,
    errorElement: <RootErrorBoundary><RouteLoader /></RootErrorBoundary>,
  },
  {
    path: '/login',
    element: <React.Suspense fallback={<RouteLoader />}><AuthPageWrapper defaultMode="login" /></React.Suspense>,
  },
  {
    path: '/signup',
    element: <React.Suspense fallback={<RouteLoader />}><AuthPageWrapper defaultMode="signup" /></React.Suspense>,
  },
  {
    path: '/onboarding',
    children: [
      {
        path: 'name-entry',
        element: (<ProtectedRoute requireOnboarding><OnboardingName /></ProtectedRoute>),
      },
      {
        path: 'welcome',
        element: (<ProtectedRoute requireOnboarding><OnboardingWelcome /></ProtectedRoute>),
      },
    ],
  },
  {
    path: '/dashboard/*',
    element: (<ProtectedRoute><DashboardLayout /></ProtectedRoute>),
    children: [
      { index: true, element: <Navigate to="/dashboard/crm" replace /> },
      { path: 'crm', element: <CrmRoute /> },
      { path: 'settings', element: <SettingsRoute /> },
      { path: 'upgrade', element: <UpgradeRoute /> },
      { path: 'applications/:id', element: <ApplicationDetailRoute /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function AuthPageWrapper({ defaultMode }: { defaultMode: 'login' | 'signup' }) {
  // We reuse existing AuthPage which includes both modes internally; we only hint the initial mode via hash
  // When mounted, we set a hash that AuthPage could read in the future; for now it shows a toggle.
  React.useEffect(() => {
    try {
      if (defaultMode === 'signup') window.history.replaceState(null, '', '/signup');
    } catch {}
  }, [defaultMode]);
  return <AuthPage onLogin={() => { /* navigation handled by App after auth */ }} />;
}

export default router;

