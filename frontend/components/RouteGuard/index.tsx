import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import useNotifications from "@/hooks/notifications";

export default function RouteGuard({ protectedRoutes, children }) {
  const router = useRouter();
  const { address } = useAccount();
  const { notifyNoWalletConnection } = useNotifications();

  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

  useEffect(() => {
    if (pathIsProtected) {
      router.push("/");
      notifyNoWalletConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, router]);

  return children;
}
