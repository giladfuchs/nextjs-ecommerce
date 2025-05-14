"use client";

import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Product } from "lib/types";
import { useDispatch } from "react-redux";
import { addItem } from "../../lib/store/cartSlice";
import { FormattedMessage, useIntl } from "react-intl";

export function AddToCart({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const intl = useIntl();

  const handleAddToCart = () => {
    dispatch(addItem({ product }));
    const openCartEvent = new CustomEvent("open-cart");
    window.dispatchEvent(openCartEvent);
  };

  return (
    <Button
      data-testid="add-to-cart-button"
      onClick={handleAddToCart}
      fullWidth
      variant="contained"
      disabled={!product.available}
      startIcon={<AddIcon />}
      aria-label={intl.formatMessage({ id: "product.addToCart" })}
      sx={{ direction: "ltr" }} // force icon on the left
    >
      <FormattedMessage
        id={product.available ? "product.addToCart" : "product.outOfStock"}
      />
    </Button>
  );
}
