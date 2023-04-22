import { useContext } from "react";
import { useRouter } from "next/router";
import { unsetSessionInfo } from "../../../lib/tokenManagement";
import { ResetUrqlContext } from "@/providers/ResetUrqlContext";

// Performs a login of the user if an access token is provided (albeit persisting the token) or there already exists a persisted access token.
export function useLogout() {
  const router = useRouter();
  const resetUrqlClient = useContext(ResetUrqlContext);
  return () => {
    unsetSessionInfo();
    resetUrqlClient?.();
    router.push("/?logout=true");
    return undefined;
  };
}
