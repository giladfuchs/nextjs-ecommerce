"use client";

import { AGTableModelType, ModelType } from "../../../lib/types";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  TextField,
  Button,
  Skeleton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import { useIntl, FormattedMessage } from "react-intl";

import {
  getCategories,
  getOrders,
  getProducts,
  modelCache,
} from "../../../lib/api";
import { get_columns_by_title } from "../../../lib/types";
import { ColDef } from "ag-grid-community";
import AGTable from "../../../components/admin/table/AGTable";

export default function AdminPage({
                                    params,
                                  }: {
  params: { model: ModelType };
}) {
  const router = useRouter();
  const { model } = params;
  const { formatMessage } = useIntl();

  const [rows, setRows] = useState<AGTableModelType[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  const cols: ColDef<AGTableModelType>[] = get_columns_by_title(model);

  useEffect(() => {
    const cached = modelCache.get(model);
    if (cached) {
      setRows(cached);
    } else {
      setLoading(true);
    }

    const load = async () => {
      const data =
          model === "product"
              ? await getProducts(true)
              : model === "order"
                  ? await getOrders()
                  : await getCategories(true);

      modelCache.set(model, data);
      setRows(data);
      setLoading(false);
    };

    load();
  }, [model]);

  const filteredRows = useMemo(() => {
    if (!searchValue) return rows;
    const regex = new RegExp(searchValue, "i");
    return rows.filter((row) => regex.test(Object.values(row).join(" ")));
  }, [searchValue, rows]);

  return (
      <Container disableGutters sx={{ px: 2 }}>
        <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            direction="row"
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
            <FormattedMessage id={`admin.${model}.title`} />
          </h2>

          <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: 4 }}>
            {filteredRows.length}
          </p>

          <TextField
              variant="outlined"
              size="small"
              placeholder={formatMessage({ id: "admin.search.placeholder" })}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{ minWidth: 200 }}
          />

          {model !== "order" && (
              <Grid item display="flex" gap={2}>
                <Button
                    variant="contained"
                    onClick={() => router.push(`/admin/form/${model}/add`)}
                    startIcon={<AddIcon />}
                >
                  <FormattedMessage id={`admin.${model}.add`} />
                </Button>

                {model === "product" && (
                    <Button
                        variant="outlined"
                        onClick={() => window.open("/admin/form/image", "_blank")}
                        startIcon={<ImageIcon />}
                    >
                      <FormattedMessage id="admin.product.image" />
                    </Button>
                )}
              </Grid>
          )}
        </Grid>

        <Grid container justifyContent="center" mt={2}>
          {loading ? (
              <Box width="100%">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <Skeleton
                        key={idx}
                        variant="rectangular"
                        height={40}
                        sx={{ mb: 1, borderRadius: 1 }}
                    />
                ))}
              </Box>
          ) : (
              <AGTable cols={cols} rows={filteredRows} />
          )}
        </Grid>
      </Container>
  );
}