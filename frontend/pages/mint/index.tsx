import { useState, useContext } from "react";
import styles from "./style.module.scss";
import { Card, Illustration, Button, IllustrationProps, useNotification, notifyType, IPosition } from "@web3uikit/core";
import { Web3Context } from "../../contexts/Web3Context";

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
  const { myTokenContract, myNFTContract } = useContext(Web3Context);

  const dispatch = useNotification();

  const onMint = {
    [MintOption.ERC20]: async () => {
      await myTokenContract.mint(1);
      handleNewNotification("Token minted!", "success", undefined, "topL");
    },
    [MintOption.ERC721]: async () => {
      await myNFTContract.mint(1);
      handleNewNotification("NFT minted!", "success", undefined, "topL");
    },
  };

  async function handleMint() {
    try {
      await onMint[selected]();
    } catch (error) {
      handleNewNotification(error.message, "error", undefined, "topL");
    } finally {
      setSelected(MintOption.NONE);
    }
  }

  const handleNewNotification = (message: string, type: notifyType, icon?: React.ReactElement, position?: IPosition) => {
    dispatch({
      type,
      message,
      title: "New Notification",
      icon,
      position: position || "topR",
    });
  };

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
        <Button onClick={() => handleMint()} disabled={selected === MintOption.NONE} theme="primary" size="large" text="Mint" />
      </div>
    </section>
  );
}
