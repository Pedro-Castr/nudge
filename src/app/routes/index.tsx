import { createBrowserRouter } from "react-router-dom";

import { AuthPage } from "../../features/auth/pages/authPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
]);

export default router;
