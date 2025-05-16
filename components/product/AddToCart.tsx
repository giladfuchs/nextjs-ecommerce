"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
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

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          "https://store.yaarafoodforest.com"
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url:   "https://store.yaarafoodforest.com",
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("שיתוף לא נתמך במכשיר הזה");
    }
  };

  return (
      <Grid item>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
              data-testid="add-to-cart-button"
              onClick={handleAddToCart}
              fullWidth
              variant="contained"
              disabled={!product.available}
              startIcon={<AddIcon />}
              aria-label={intl.formatMessage({ id: "product.addToCart" })}
              sx={{ direction: "ltr", flexGrow: 1 }}
          >
            <FormattedMessage
                id={product.available ? "product.addToCart" : "product.outOfStock"}
            />
          </Button>

          <Stack direction="row" spacing={1}>
            <Tooltip title="שתף בפייסבוק">
              <IconButton
                  aria-label="שתף בפייסבוק"
                  onClick={handleFacebookShare}
                  data-testid="share-facebook"
                  size="small"
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="שתף">
              <IconButton
                  aria-label="שתף"
                  onClick={handleNativeShare}
                  data-testid="share-native"
                  size="small"
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Grid>
  );
}