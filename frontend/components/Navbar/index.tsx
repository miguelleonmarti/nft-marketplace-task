import styles from "./style.module.scss";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { User, Home, Stars } from "@web3uikit/icons";

export default function Navbar() {
  const { isConnected } = useAccount();
  const { pathname } = useRouter();
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    setIsHome(pathname === "/");
  }, [pathname]);

  return (
    <nav className={styles.menu}>
      <ul>
        {isConnected && (
          <>
            {!isHome && (
              <li className={styles.left}>
                <Link href={"/"}>
                  <Home fontSize="25px" style={{ cursor: "pointer" }} />
                </Link>
              </li>
            )}
            <li>
              <Link href={"/mint"}>
                <Stars fontSize="25px" style={{ cursor: "pointer" }} />
              </Link>
            </li>
            <li>
              <Link href={"/profile"}>
                <User fontSize="25px" style={{ cursor: "pointer" }} />
              </Link>
            </li>
          </>
        )}
        <li className={styles.right}>
          <ConnectButton
            showBalance={{ smallScreen: false, largeScreen: false }}
            chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
            accountStatus={"full"}
          />
        </li>
      </ul>
    </nav>
  );
}
