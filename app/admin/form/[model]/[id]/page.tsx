"use client";
import {Container, Typography} from "@mui/material";
import FormChild from "../../../../../components/admin/form/FormChild";
import {
    array_obj_to_obj_with_key,
    create_form_fields,
    FormField,
    get_form_by_model,
    ModelType,
    Image, AGTableModelType,
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
    const [imagesError, setImagesError] = useState(false);

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
            send_fields.map((f) => [
                f.key,
                typeof f.value === "string" ? f.value.trim() : f.value,
            ]),
        );

        if (model === ModelType.product) {
            const filteredImages = data.images.filter(
                (img: Image) => img.url.trim() !== "" || img.altText.trim() !== "",
            );

            if (filteredImages.length === 0) {
                setImagesError(true);
                return;
            }

            data.images = filteredImages;

            const category = array_obj_to_obj_with_key(
                list.categories,
                data.category,
                "handle",
            );
            data.category_id = category.id;
            delete data.category;
        }

        setImagesError(false);
        try {
            const result: AGTableModelType = await submitModel(model, id, data) as AGTableModelType;
            toast.success(intl.formatMessage({id: "form.success"}), {
                description: `ID: ${result.id}`,
            });
            router.push(`/admin/${model}`);
        } catch (err) {
            toast.error(intl.formatMessage({id: "form.error"}));
            console.error("❌ Failed to submit:", err);
        }
    };

    return (
        <Container maxWidth="lg" disableGutters sx={{py: 4}}>
            {fields.length > 0 && (
                <>
                    {imagesError && model === ModelType.product && (
                        <Typography
                            variant="h6"
                            color="error"
                            sx={{textAlign: "center", mb: 2, fontWeight: "bold"}}
                        >
                            <FormattedMessage id="form.image.required"/>
                        </Typography>
                    )}
                    <FormChild title={title} fields={fields} onSubmit={handleSubmit}/>
                </>
            )}
        </Container>
    );
}
