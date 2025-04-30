'use client'
import {Container} from "@mui/material";
import FormChild from "../../FormChild";
import {array_obj_to_obj_with_key, create_form_fields, FormField, get_form_by_model, ModelType} from "../../form";
import {use, useEffect, useState} from "react";
import {getCollections, getProducts, submitModel} from "../../../../lib/api";
import {Image} from "../../../../lib/types";

export default function FormPage({
                                     params,
                                 }: {
    params: Promise<{ model: ModelType; id: string }>;
}) {
    const {model, id} = use(params);
    const [list, setList] = useState<Record<string, any[]>>({product: [], collection: []});
    const [fields, setFields] = useState<FormField[]>([]);

    const is_add = id === "add";

    useEffect(() => {
        const init = async () => {
            const products = await getProducts();
            const collections = await getCollections();
            setList({product: products, collection: collections});

            const model_objs = model === ModelType.product ? products : collections;
            const obj = is_add ? {} : array_obj_to_obj_with_key(model_objs, Number(id), "id") ?? {};

            const fields_to_set: FormField[] = create_form_fields(get_form_by_model(model), obj);


            setFields(fields_to_set);

        }

        init();
    }, [model]);

    const collections_title: string[] = list.collection.map((c) => c.title);


    const title = `${is_add ? "הוספה" : "עריכה"}_${model}`;

    const handleSubmit = async (send_fields: FormField[], images: Image[]) => {
        const data: any = Object.fromEntries(send_fields.map((f) => [f.key, f.value]));

        if (model === ModelType.product) {
            data.images = images;
        }

        try {
            const response = await submitModel(model, id, data);
            const result = await response.json();
            console.log('✅ Submitted:', result);
        } catch (err) {
            console.error('❌ Failed to submit:', err);
        }
    };
    return (
        <Container maxWidth="lg" disableGutters sx={{py: 4}}>
            <>
                {fields.length > 0 &&
                    <FormChild title={title} collections={collections_title} fields={fields} onSubmit={handleSubmit}/>
                }
            </>

        </Container>
    );
}
