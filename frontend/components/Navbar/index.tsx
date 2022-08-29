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
              <Link href={"/"}>HOME</Link>
            </li>
            <li>
              <Link href={"/mint"}>MINT</Link>
            </li>
            <li>
              <Link href={"/profile"}>PROFILE</Link>
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
