import styles from "./style.module.scss";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className={styles.menu}>
      <ul>
        <li>
          <Link href={"/mint"}>Mint</Link>
        </li>
        <li>
          <Link href={"/profile"}>Profile</Link>
        </li>
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
