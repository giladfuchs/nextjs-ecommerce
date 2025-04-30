'use client'
import {Container} from "@mui/material";
import FormChild from "../../FormChild";
import {
    array_obj_to_obj_with_key,
    create_form_fields,
    FormField,
    FormType,
    get_form_by_model,
    ModelType
} from "../../form";
import {useEffect, useState} from "react";
import {getCollections, getProducts} from "../../../../lib/api";
import {use} from 'react';

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

            const model_objs = list[model];
            const obj = is_add ? {} : array_obj_to_obj_with_key(model_objs, id, "id") ?? {};

            const fields_to_set: FormField[] = create_form_fields(get_form_by_model(model), obj);

            if (model === ModelType.product) {
                fields_to_set.push({
                    key: 'collection',
                    value: '',
                    type: FormType.AutoComplete,
                    options: []
                });
            }

            setFields(fields_to_set);

        }

        init();
    }, [model]);

    const collections_title: string[] = list.collection.map((c) => c.title);


    const title = `${is_add ? "הוספה" : "עריכה"}_${model}`;

    const handleSubmit = async (send_fields: FormField[]) => {
        const data = Object.fromEntries(send_fields.map((f) => [f.key, f.value]));
        console.log(data);
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
