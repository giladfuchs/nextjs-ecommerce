"use client";

import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { notFound } from "next/navigation";
import { email } from "components/layout/Footer";

export const legalContent: Record<
    "terms" | "accessibility",
    {
        sections: {
            title: string;
            paragraphs?: string[];
            list?: string[];
            contact?: string;
        }[];
    }
> = {
    accessibility: {
        sections: [
            {
                title: "terms.accessibility.pickupTitle",
                paragraphs: ["terms.accessibility.pickup"],
            },
            {
                title: "terms.accessibility.title",
                paragraphs: ["terms.accessibility.intro"],
                list: [
                    "accessibility.zoomIn",
                    "accessibility.zoomOut",
                    "accessibility.grayscale",
                    "accessibility.contrast",
                    "accessibility.invert",
                    "accessibility.underline",
                    "accessibility.readableFont",
                ],
                contact: "terms.accessibility.contact",
            },
        ],
    },
    terms: {
        sections: [
            {
                title: "terms.title",
                paragraphs: ["terms.intro"],
            },
            {
                title: "terms.section.exchanges",
                paragraphs: ["terms.exchanges"],
            },
            {
                title: "terms.section.privacy",
                paragraphs: ["terms.privacy"],
            },
            {
                title: "terms.section.contact",
                contact: "terms.contact",
            },
        ],
    },
};

export default function LegalPage({ params }: { params: { handle: string } }) {
    const { handle } = params;

    if (!["terms", "accessibility"].includes(handle)) {
        notFound();
    }

    const content = legalContent[handle as "terms" | "accessibility"];

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
            {content.sections.map((section, idx) => (
                <section key={idx}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        mt={idx > 0 ? 4 : 0}
                    >
                        <FormattedMessage id={section.title} />
                    </Typography>

                    {section.paragraphs?.map((pid, i) => (
                        <Typography paragraph key={i}>
                            <FormattedMessage id={pid} />
                        </Typography>
                    ))}

                    {section.list && (
                        <ul>
                            {section.list.map((lid, i) => (
                                <li key={i}>
                                    <FormattedMessage id={lid} />
                                </li>
                            ))}
                        </ul>
                    )}

                    {section.contact && (
                        <Typography mt={2}>
                            <FormattedMessage
                                id={section.contact}
                                values={{
                                    email: <a href={`mailto:${email}`}>{email}</a>,
                                }}
                            />
                        </Typography>
                    )}
                </section>
            ))}
        </Box>
    );
}