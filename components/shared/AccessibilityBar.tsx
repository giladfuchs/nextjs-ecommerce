"use client";

import { useEffect, useState, useRef } from "react";
import { Box, IconButton, Typography, Stack } from "@mui/material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LinkIcon from "@mui/icons-material/Link";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BarcodeIcon from "@mui/icons-material/ViewColumn";
import GavelIcon from "@mui/icons-material/Gavel";
import { FormattedMessage } from "react-intl";

const ActionItem = ({
  icon,
  labelId,
  onClick,
  selected = false,
}: {
  icon: React.ReactNode;
  labelId: string;
  onClick: () => void;
  selected?: boolean;
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      px: 1,
      py: 0.5,
      borderRadius: 1,
      cursor: "pointer",
      backgroundColor: selected
        ? "var(--category-active-bg, #e0f7fa)"
        : "transparent",
      fontWeight: selected ? "bold" : "normal",
      transition: "background-color 0.2s",
      "&:hover": {
        backgroundColor: "var(--category-hover-bg, #e0f7fa)",
      },
    }}
  >
    <Typography fontSize="0.9rem">
      <FormattedMessage id={labelId} />
    </Typography>
    {icon}
  </Box>
);
export default function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [invert, setInvert] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sizes = [
      "font-size-80",
      "font-size-90",
      "font-size-100",
      "font-size-110",
      "font-size-120",
      "font-size-150",
      "font-size-200",
    ];
    document.documentElement.classList.remove(...sizes);
    document.documentElement.classList.add(`font-size-${fontSize}`);
    document.documentElement.classList.toggle("grayscale", grayscale);
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.classList.toggle("invert", invert);
    document.documentElement.classList.toggle(
      "underline-links",
      underlineLinks,
    );
    document.documentElement.classList.toggle("readable-font", readableFont);
  }, [fontSize, highContrast, invert, grayscale, underlineLinks, readableFont]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const skipSizes = [140, 160, 180];
  const increaseFont = () => {
    if (fontSize >= 200) return;
    const next = fontSize + 20;
    setFontSize(skipSizes.includes(next) ? 200 : next);
  };
  const decreaseFont = () => {
    if (fontSize <= 80) return;
    const next = fontSize - 20;
    setFontSize(skipSizes.includes(next) ? 120 : next);
  };
  const reset = () => {
    setFontSize(100);
    setHighContrast(false);
    setInvert(false);
    setGrayscale(false);
    setUnderlineLinks(false);
    setReadableFont(false);
  };

  return (
    <div
      className="fixed left-3 top-1/2 z-50 -translate-y-1/2"
      dir="rtl"
      style={{ display: "flex", alignItems: "center" }}
    >
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          backgroundColor: "#124cda",
          color: "var(--color-bg)",
          "&:hover": { backgroundColor: "#124cda" },
          "&:focus, &:active": { backgroundColor: "#124cda", opacity: 1 },
          zIndex: 10,
        }}
      >
        <AccessibleIcon />
      </IconButton>

      {open && (
        <Box
          ref={panelRef}
          className="accessibility-panel"
          sx={{
            ml: 1,
            width: 200,
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            border: "1px solid var(--color-border)",
            color: "var(--color-text-strong)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            fontSize="1rem"
            mb={1}
          >
            <FormattedMessage id="accessibility.title" />
          </Typography>

          <Stack spacing={1}>
            <ActionItem
              labelId="accessibility.zoomIn"
              icon={<ZoomInIcon />}
              onClick={increaseFont}
            />
            <ActionItem
              labelId="accessibility.zoomOut"
              icon={<ZoomOutIcon />}
              onClick={decreaseFont}
            />
            <ActionItem
              labelId="accessibility.grayscale"
              icon={<BarcodeIcon />}
              onClick={() => setGrayscale(!grayscale)}
              selected={grayscale}
            />
            <ActionItem
              labelId="accessibility.contrast"
              icon={<InvertColorsIcon />}
              onClick={() => setHighContrast(!highContrast)}
              selected={highContrast}
            />
            <ActionItem
              labelId="accessibility.invert"
              icon={<VisibilityIcon />}
              onClick={() => setInvert(!invert)}
              selected={invert}
            />
            <ActionItem
              labelId="accessibility.underline"
              icon={<LinkIcon />}
              onClick={() => setUnderlineLinks(!underlineLinks)}
              selected={underlineLinks}
            />
            <ActionItem
              labelId="accessibility.readableFont"
              icon={<Typography fontWeight="bold">Aa</Typography>}
              onClick={() => setReadableFont(!readableFont)}
              selected={readableFont}
            />
            <ActionItem
              labelId="accessibility.reset"
              icon={<RestartAltIcon />}
              onClick={reset}
            />
            <ActionItem
                labelId="terms.accessibility.title"
                icon={<GavelIcon />}
                onClick={() => window.open("/legal/accessibility", "_blank")}
            />
          </Stack>
        </Box>
      )}
    </div>
  );
}
