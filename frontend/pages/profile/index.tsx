import styles from "./style.module.scss";
import { useState, useEffect } from "react";
import { Table, Button, Typography } from "@web3uikit/core";
import { getNftsForOwner } from "../../utils/alchemy";
import { useAccount } from "wagmi";
import { app } from "../../config";

const header: string[] = ["Address", "Token ID", "Actions"];

const SellButton = () => {
  return <Button onClick={() => console.log("mint")} theme="secondary" size="large" text="Sell"></Button>;
};

export default function Profile() {
  const [nfts, setNfts] = useState<{ address: string; tokenId: string }[]>();
  const [orders, setOrders] = useState([]);
  const { address } = useAccount();

  function formatNftData() {
    return nfts?.map(({ address, tokenId }) => {
      return [address, tokenId, <SellButton key={address + tokenId} />];
    });
  }

  useEffect(() => {
    if (!address) return;

    async function getNfts() {
      const onlyAddressAndTokenId = ({ contract: { address }, tokenId }) => ({ address, tokenId });
      const sameContract = ({ address }) => address === app.nftAddress.toLowerCase();
      const { ownedNfts } = await getNftsForOwner(address);
      const validNfts = ownedNfts.map(onlyAddressAndTokenId).filter(sameContract);
      setNfts(validNfts);
    }

    getNfts();
  }, [address]);

  return (
    <section className={styles.profile}>
      <Typography variant="h2" style={{ margin: "1rem" }}>
        My NFTs
      </Typography>
      <Table
        columnsConfig="4fr 1fr 1fr"
        isLoading={!nfts}
        data={formatNftData()}
        header={header}
        isColumnSortable={[true, true, false]}
        maxPages={3}
        // onPageNumberChanged={function noRefCheck() {}}
        // onRowClick={function noRefCheck() {}}
        pageSize={2}
      ></Table>
      {/* <Typography variant="h2" style={{ margin: "1rem" }}>
        My Orders
      </Typography>
      <Table
        columnsConfig="4fr 1fr 1fr"
        isLoading={!orders}
        data={orders}
        header={header}
        isColumnSortable={[true, true, false]}
        maxPages={3}
        onPageNumberChanged={function noRefCheck() {}}
        onRowClick={function noRefCheck() {}}
        pageSize={2}
      ></Table> */}
    </section>
  );
}
