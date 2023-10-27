import { Session, SupabaseClient } from "@supabase/supabase-js";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { GetServerSession } from "../auth";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

type CreateContextOptions = {
  supabase: SupabaseClient | null;
  session: Session | null;
};

export const createContextInner = (opts: CreateContextOptions) => {
  return {
    supabase: opts.supabase,
    session: opts.session,
  };
};

export const createContext = async () => {
  console.log("awoidjaiowdj");
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const session = await GetServerSession();
  return createContextInner({
    supabase,
    session,
  });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
