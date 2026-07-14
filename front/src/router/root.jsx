import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import productsRouter from "./productsRouter";
import healthGoalRouter from "./healthGoalRouter";
import memberRouter from "./memberRouter";

const Loading = <div>Loading...</div>;
const Main = lazy(() => import("../pages/MainPage"));
const About = lazy(() => import("../pages/AboutPage"));
const ProductsIndex = lazy(() => import("../pages/products/IndexPage"));
const HealthGoalIndex = lazy(() => import("../pages/healthgoal/IndexPage"));
const OrderComplete = lazy(() => import("../pages/order/CompletePage"));
const OrderList = lazy(() => import("../pages/order/ListPage"));
const MyPage = lazy(() => import("../pages/mypage/IndexPage"));
const AIPage = lazy(() => import("../pages/AIPage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));

// 공지사항
const NoticeList = lazy(() => import("../pages/notice/ListPage"));
const NoticeRead = lazy(() => import("../pages/notice/ReadPage"));
const NoticeAdd = lazy(() => import("../pages/notice/AddPage"));

// 게시판
const BoardList = lazy(() => import("../pages/board/ListPage"));
const BoardRead = lazy(() => import("../pages/board/ReadPage"));
const BoardAdd = lazy(() => import("../pages/board/AddPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={Loading}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/products",
    element: (
      <Suspense fallback={Loading}>
        <ProductsIndex />
      </Suspense>
    ),
    children: productsRouter(),
  },
  {
    path: "/healthgoal",
    element: (
      <Suspense fallback={Loading}>
        <HealthGoalIndex />
      </Suspense>
    ),
    children: healthGoalRouter(),
  },
  {
    path: "/member",
    children: memberRouter(),
  },
  {
    path: "/order/complete",
    element: (
      <Suspense fallback={Loading}>
        <OrderComplete />
      </Suspense>
    ),
  },
  {
    path: "/order/list",
    element: (
      <Suspense fallback={Loading}>
        <OrderList />
      </Suspense>
    ),
  },
  {
    path: "/mypage",
    element: (
      <Suspense fallback={Loading}>
        <MyPage />
      </Suspense>
    ),
  },
  {
    path: "/ai",
    element: (
      <Suspense fallback={Loading}>
        <AIPage />
      </Suspense>
    ),
  },
  {
    path: "/cart",
    element: (
      <Suspense fallback={Loading}>
        <CartPage />
      </Suspense>
    ),
  },
  {
    path: "/notice",
    element: (
      <Suspense fallback={Loading}>
        <NoticeList />
      </Suspense>
    ),
  },
  {
    path: "/notice/add",
    element: (
      <Suspense fallback={Loading}>
        <NoticeAdd />
      </Suspense>
    ),
  },
  {
    path: "/notice/:nno",
    element: (
      <Suspense fallback={Loading}>
        <NoticeRead />
      </Suspense>
    ),
  },
  {
    path: "/board",
    element: (
      <Suspense fallback={Loading}>
        <BoardList />
      </Suspense>
    ),
  },
  {
    path: "/board/add",
    element: (
      <Suspense fallback={Loading}>
        <BoardAdd />
      </Suspense>
    ),
  },
  {
    path: "/board/:bno",
    element: (
      <Suspense fallback={Loading}>
        <BoardRead />
      </Suspense>
    ),
  },
]);

export default router;
