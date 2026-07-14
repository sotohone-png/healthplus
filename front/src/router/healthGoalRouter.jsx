import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;

const HealthGoalIndex = lazy(() => import("../pages/healthgoal/IndexPage"));
const HealthGoalList = lazy(() => import("../pages/healthgoal/ListPage"));
const HealthGoalAdd = lazy(() => import("../pages/healthgoal/AddPage"));
const HealthGoalRead = lazy(() => import("../pages/healthgoal/ReadPage"));
const HealthGoalModify = lazy(() => import("../pages/healthgoal/ModifyPage"));

const healthGoalRouter = () => [
  {
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <HealthGoalIndex />
      </Suspense>
    ),
    children: [
      { path: "", element: <Navigate replace to="list" /> },
      {
        path: "list",
        element: (
          <Suspense fallback={Loading}>
            <HealthGoalList />
          </Suspense>
        ),
      },
      {
        path: "add",
        element: (
          <Suspense fallback={Loading}>
            <HealthGoalAdd />
          </Suspense>
        ),
      },
      {
        path: "read/:tno",
        element: (
          <Suspense fallback={Loading}>
            <HealthGoalRead />
          </Suspense>
        ),
      },
      {
        path: "modify/:tno",
        element: (
          <Suspense fallback={Loading}>
            <HealthGoalModify />
          </Suspense>
        ),
      },
    ],
  },
];

export default healthGoalRouter;