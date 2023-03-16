import { router, publicProcedure } from "../trpc";

export const timeseriesRouter = router({
  hello: publicProcedure.query(({ ctx }) => {
    return "hello";
  }),
});
