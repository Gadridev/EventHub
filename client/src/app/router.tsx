import { createBrowserRouter, Link } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { EventsPage } from "../features/events/pages/EventsPage";
import { EventDetailsPage } from "../features/events/pages/EventDetailsPage";
import { ParticipantsPage } from "../features/participants/pages/ParticipantsPage";
import { RegistrationsPage } from "../features/registrations/pages/RegistrationsPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { PublicOnlyRoute } from "../features/auth/PublicOnlyRoute";
export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/events", element: <EventsPage /> },
          { path: "/events/:eventId", element: <EventDetailsPage /> },
          { path: "/participants", element: <ParticipantsPage /> },
          { path: "/registrations", element: <RegistrationsPage /> },
          {
            path: "*",
            element: (
              <>
                <h1 className="text-3xl">Page not found</h1>
                <Link className="text-accent" to="/">
                  Return to overview
                </Link>
              </>
            ),
          },
        ],
      },
    ],
  },
]);
