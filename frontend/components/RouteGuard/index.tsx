import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import useNotifications from "@/hooks/useNotifications";

export default function RouteGuard({ protectedRoutes, children }) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { notifyNoWalletConnection } = useNotifications();

  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

  useEffect(() => {
    if (pathIsProtected && !isConnected) {
      router.push("/");
      notifyNoWalletConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, router]);

  return children;
}
