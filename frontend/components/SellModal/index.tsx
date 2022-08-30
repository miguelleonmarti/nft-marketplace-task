import { useState } from "react";
import { Modal, Typography, Input } from "@web3uikit/core";

export default function SellModal({ isVisible, setIsVisible, tokenAddress, tokenId, onSell }) {
  const [price, setPrice] = useState<number>(0);
  const regex = /^[1-9]\d*$/;

  return (
    <div>
      <Modal
        id="sellModal"
        isVisible={isVisible}
        okText="List"
        isOkDisabled={!regex.test(String(price))}
        hasCancel={false}
        onCloseButtonPressed={() => setIsVisible(false)}
        onOk={() => {
          setIsVisible(false);
          onSell(tokenAddress, tokenId, price);
        }}
        title={
          <div key={"sell-modal-title"}>
            <Typography color="#68738D" variant="h3">
              Sell NFT
            </Typography>
          </div>
        }
      >
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column" }}>
          <Typography color="#68738D" variant="h5">
            Token Address: {tokenAddress}
          </Typography>
          <Typography color="#68738D" variant="h5">
            Token ID: {tokenId}
          </Typography>
          <Input
            label="Price"
            name="price"
            width="100%"
            type="number"
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ marginTop: "2rem" }}
          />
        </div>
      </Modal>
    </div>
  );
}
