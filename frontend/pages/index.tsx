import type { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import { Table } from "@web3uikit/core";
import useHome from "@/hooks/useHome";

const Home: NextPage = () => {
  const { orders, formatOrderData } = useHome();

  return (
    <section className={styles.main}>
      <Table
        columnsConfig="2fr 2fr 2fr 2fr 2fr"
        isLoading={!orders}
        data={formatOrderData()}
        header={["NFT Address", "NFT ID", "Token Address", "Token Amount", "Actions"]}
        isColumnSortable={[true, true, true, true, false]}
        maxPages={5}
        pageSize={10}
      ></Table>
    </section>
  );
};

export default Home;
