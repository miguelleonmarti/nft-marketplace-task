import { useState, useContext } from "react";
import styles from "./style.module.scss";
import { Card, Illustration, Button, IllustrationProps } from "@web3uikit/core";

enum MintOption {
  NONE,
  ERC20,
  ERC721,
}

const cards: { type: MintOption; title: string; props: IllustrationProps }[] = [
  { type: MintOption.ERC20, title: "ERC20", props: { logo: "token", height: "180px", width: "100%" } },
  { type: MintOption.ERC721, title: "ERC721", props: { logo: "lazyNft", height: "180px", width: "100%" } },
];

export default function Mint() {
  const [selected, setSelected] = useState<MintOption>(MintOption.NONE);

  function renderCards() {
    return cards.map(({ type, title, props }) => (
      <article key={type} className={styles.option}>
        <Card isSelected={selected === type} setIsSelected={(value) => setSelected(value ? type : MintOption.NONE)} title={title}>
          <div>
            <Illustration {...props} />
          </div>
        </Card>
      </article>
    ));
  }

  return (
    <section className={styles.mint}>
      <div className={styles.options}>{renderCards()}</div>
      <div className={styles.button}>
        <Button onClick={() => console.log("mint")} disabled={selected === MintOption.NONE} theme="primary" size="large" text="Mint" />
      </div>
    </section>
  );
}
