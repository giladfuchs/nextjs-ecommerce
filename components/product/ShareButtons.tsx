"use client";

import { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function ShareButtons() {
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        setShareUrl(window.location.href);
    }, []);

    const handleFacebookShare = () => {
        const hardcodedUrl = "https://store.yaarafoodforest.com";
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(hardcodedUrl)}`;
        window.open(fbUrl, "_blank", "noopener,noreferrer");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: shareUrl,
                });
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            alert("שיתוף לא נתמך במכשיר הזה");
        }
    };

    return (
        <>
            <Tooltip title="שתף בפייסבוק">
                <IconButton
                    aria-label="שתף בפייסבוק"
                    onClick={handleFacebookShare}
                    data-testid="share-facebook"
                >
                    <FacebookIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="שתף">
                <IconButton
                    aria-label="שתף"
                    onClick={handleNativeShare}
                    data-testid="share-native"
                >
                    <ShareIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}