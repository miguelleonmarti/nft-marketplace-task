import styles from "./style.module.scss";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className={styles.menu}>
      <ul>
        {isConnected && (
          <>
            <li className={styles.left}>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/mint"}>Mint</Link>
            </li>
            <li>
              <Link href={"/profile"}>Profile</Link>
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
