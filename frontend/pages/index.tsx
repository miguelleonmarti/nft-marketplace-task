import type { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import { Table, Button } from "@web3uikit/core";

const header: string[] = ["Address", "ID", "Price", "Owner", "Button"];

const BuyButton = () => {
  return <Button onClick={() => console.log("mint")} theme="secondary" size="large" text="Buy"></Button>;
};

const data = [
  ["0x123456789", "130", "18.0", "0x0000000", <BuyButton key={"130"} />],
  ["0x123456789", "65", "27.0", "0x0000000", <BuyButton key={"65"} />],
  ["0x123456789", "4", "48.0", "0x0000000", <BuyButton key={"4"} />],
  ["0x123456789", "1", "199.0", "0x0000000", <BuyButton key={"1"} />],
];

const Home: NextPage = () => {
  return (
    <section className={styles.main}>
      <Table
        columnsConfig="4fr 2fr 2fr 4fr 2fr"
        data={data}
        header={header}
        isColumnSortable={[false, true, true, false]}
        maxPages={3}
        onPageNumberChanged={function noRefCheck() {}}
        onRowClick={function noRefCheck() {}}
        pageSize={2}
      ></Table>
    </section>
  );
};

export default Home;
