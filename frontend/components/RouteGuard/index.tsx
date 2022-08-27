import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

export default function RouteGuard({ protectedRoutes, children }) {
  const router = useRouter();
  const { address } = useAccount();

  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

  useEffect(() => {
    if (pathIsProtected) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, router]);

  return children;
}
