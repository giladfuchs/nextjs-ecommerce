"use client";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { notFound } from "next/navigation";
import { email } from "../../../components/layout/Footer";


export default function LegalPage({ params }: { params: { handle: string } }) {
    const { handle } = params;

    return (
        <Box
            component="main"
            sx={{
                maxWidth: 800,
                mx: "auto",
                px: 2,
                py: 4,
                color: "var(--color-text)",
                bgcolor: "var(--color-bg)",
                direction: "rtl",
                ".high-contrast &": {
                    color: "yellow",
                    bgcolor: "black",
                },
            }}
        >
            {handle === "accessibility" ? (
                <>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                    <FormattedMessage id="terms.accessibility.pickupTitle" />
                    </Typography>
                    <Typography paragraph>
                        <FormattedMessage id="terms.accessibility.pickup" />
                    </Typography>

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        <FormattedMessage id="terms.accessibility.title" />
                    </Typography>

                    <Typography paragraph>
                        <FormattedMessage id="terms.accessibility.intro" />
                    </Typography>

                    <ul>
                        <li>
                            <FormattedMessage id="accessibility.zoomIn" />
                        </li>
                        <li>
                            <FormattedMessage id="accessibility.zoomOut" />
                        </li>
                        <li>
                            <FormattedMessage id="accessibility.grayscale" />
                        </li>
                        <li>
                            <FormattedMessage id="accessibility.contrast" />
                        </li>
                        <li>
                            <FormattedMessage id="accessibility.invert" />
                        </li>
                        <li>
                            <FormattedMessage id="accessibility.underline" />
                        </li>
                        <li>
                            <FormattedMessage id="accessibility.readableFont" />
                        </li>
                    </ul>



                    <Typography mt={3}>
                        <FormattedMessage
                            id="terms.accessibility.contact"
                            values={{
                                email: <a href={`mailto:${email}`}>{email}</a>,
                            }}
                        />
                    </Typography>
                </>
            ) : handle === "terms" ? (
                <>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        <FormattedMessage id="terms.title" />
                    </Typography>

                    <Typography paragraph>
                        <FormattedMessage id="terms.intro" />
                    </Typography>


                    <Typography variant="h4" fontWeight="bold" gutterBottom mt={3}>
                    <FormattedMessage id="terms.section.exchanges" />
                    </Typography>
                    <Typography paragraph>
                        <FormattedMessage id="terms.exchanges" />
                    </Typography>

                    <Typography variant="h4" fontWeight="bold" gutterBottom mt={3}>

                    <FormattedMessage id="terms.section.privacy" />
                    </Typography>
                    <Typography paragraph>
                        <FormattedMessage id="terms.privacy" />
                    </Typography>

                    <Typography variant="h4" fontWeight="bold" gutterBottom mt={3}>

                    <FormattedMessage id="terms.section.contact" />
                    </Typography>
                    <Typography>
                        <FormattedMessage
                            id="terms.contact"
                            values={{
                                email: <a href={`mailto:${email}`}>{email}</a>,
                            }}
                        />
                    </Typography>
                </>
            ) : (
                notFound()
            )}
        </Box>
    );
}