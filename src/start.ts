import { createStart, createMiddleware, createCsrfMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { getLocalSession } from "./lib/local-store";

const authContextMiddleware = createMiddleware({ type: "function" }).client(async ({ next, context = {}, sendContext = {} }: any) => {
  const session = getLocalSession();
  return next({
    context: {
      ...context,
      userId: session?.userId,
    },
    sendContext: {
      ...sendContext,
      userId: session?.userId,
    },
  });
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [authContextMiddleware],
  requestMiddleware: [csrfMiddleware, errorMiddleware],
}));
