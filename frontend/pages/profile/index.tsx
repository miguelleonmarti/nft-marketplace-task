import styles from "./style.module.scss";
import { Table, Typography } from "@web3uikit/core";
import SellModal from "@/components/SellModal";
import useProfile from "@/hooks/useProfile";

export default function Profile() {
  const { address, nfts, formatNftData, orders, formatOrderData, isVisible, setIsVisible, selectedNft, handleSell } = useProfile();

  if (!address) {
    return (
      <section className={styles.profile}>
        <Typography variant="h1">You need to connect the wallet</Typography>
      </section>
    );
  }

  return (
    <section className={styles.profile}>
      <Typography variant="h2" style={{ margin: "1rem" }}>
        My NFTs
      </Typography>
      <Table
        columnsConfig="4fr 1fr 1fr"
        isLoading={!nfts}
        data={formatNftData()}
        header={["Address", "Token ID", "Actions"]}
        isColumnSortable={[true, true, false]}
        maxPages={3}
        pageSize={5}
      ></Table>
      <Typography variant="h2" style={{ margin: "1rem" }}>
        My Orders
      </Typography>
      <Table
        columnsConfig="2fr 2fr 2fr 2fr 2fr"
        isLoading={!orders}
        data={formatOrderData()}
        header={["NFT Address", "NFT ID", "Token Address", "Token Amount", "Actions"]}
        isColumnSortable={[true, true, true, true, false]}
        maxPages={3}
        pageSize={2}
      ></Table>
      <SellModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        tokenAddress={selectedNft?.address}
        tokenId={selectedNft?.tokenId}
        onSell={handleSell}
      />
    </section>
  );
}
