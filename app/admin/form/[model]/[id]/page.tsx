"use client";
import {Container, Typography} from "@mui/material";
import FormChild from "../../../../../components/admin/form/FormChild";
import {
    array_obj_to_obj_with_key,
    create_form_fields,
    FormField,
    get_form_by_model,
    ModelType,
    Image,
    AGTableModelType,
} from "../../../../../lib/types";
import {useEffect, useState} from "react";
import {
    getCategories,
    getProducts,
    submitModel,
} from "../../../../../lib/api";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {FormattedMessage, useIntl} from "react-intl";

export default function FormPage({
                                     params,
                                 }: {
    params: { model: ModelType; id: string };
}) {
    const router = useRouter();
    const intl = useIntl();

    const {model, id} = params;
    const [list, setList] = useState<Record<string, any[]>>({
        product: [],
        categories: [],
    });
    const [fields, setFields] = useState<FormField[]>([]);
    const [fieldError, setFieldError] = useState<string | null>(null);

    const is_add = id === "add";

    useEffect(() => {
        const init = async () => {
            const products = await getProducts();
            const categories = await getCategories();
            setList({product: products, categories});

            const model_objs = model === ModelType.product ? products : categories;
            const obj = is_add
                ? {}
                : (array_obj_to_obj_with_key(model_objs, Number(id), "id") ?? {});

            const fields_to_set = create_form_fields(get_form_by_model(model), obj);
            setFields(fields_to_set);
        };

        init();
    }, [model, id, is_add]);

    const title = is_add ? `form.add.${model}` : `form.edit.${model}`;

    const handleSubmit = async (send_fields: FormField[]) => {
        const data = Object.fromEntries(
            send_fields.map((f) => {
                const value = typeof f.value === "string" ? f.value.trim() : f.value;
                return [f.key, value === "" ? null : value];
            })
        );

        if (model === ModelType.product) {
            const filteredImages = data.images.filter(
                (img: Image) => img.url.trim() !== "" || img.altText.trim() !== "",
            );

            if (filteredImages.length === 0) {
                setFieldError(intl.formatMessage({id: "form.error.required.images"}));

                return;
            }

            data.images = filteredImages;

            const category = array_obj_to_obj_with_key(
                list.categories,
                data.category,
                "handle",
            );
            data.category_id = category?.id;
            delete data.category;
        }

        setFieldError(null);

        try {
            const result: AGTableModelType = (await submitModel(
                model,
                id,
                data,
            )) as AGTableModelType;

            toast.success(intl.formatMessage({id: "form.success"}), {
                description: `ID: ${result.id}`,
            });
            router.push(`/admin/${model}`);
        } catch (err: any) {
            const rawMessage = err?.message || "Unknown error";
            const match = rawMessage.match(/Missing required field: (\w+)/i);
            const fieldKey = match?.[1]?.toLowerCase();

            const intlId = `form.error.required.${fieldKey}`;
            setFieldError(intl.formatMessage({id: intlId}));

            toast.error(intl.formatMessage({id: "form.error"}), {
                description: rawMessage,
            });

            console.error("❌ Failed to submit:", err);
        }
    };

    return (
        <Container maxWidth="lg" disableGutters sx={{py: 4}}>
            {fields.length > 0 && (
                <>
                    <FormChild title={title} fields={fields} onSubmit={handleSubmit}/>
                    {fieldError && (
                        <Typography
                            variant="h3"
                            color="error"
                            sx={{textAlign: "center", mt: 2, fontWeight: "bold"}}
                        >
                            {fieldError}
                        </Typography>
                    )}
                </>
            )}
        </Container>
    );
}