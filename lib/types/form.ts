/* eslint-disable max-classes-per-file */

import {FormType, ModelType} from "./enums";

export class FieldInput {
    constructor(
        readonly type: FormType = FormType.TEXT,
        public key: string,
        public value: string = "",
    ) {
    }
}

export class FieldAutoComplete {
    constructor(
        readonly type: FormType = FormType.AutoComplete,
        public key: string,
        public options: string[],
        public value: string = "",
    ) {
        this.value = options[0];
    }
}

export type FormField = FieldAutoComplete | FieldInput;

export type InputField = {
    key: string;
    type: FormType;
    value?: string;
    options?: string[];
};

export const product_fields: InputField[] = [
    {key: "title", type: FormType.TEXT},
    {key: "price", type: FormType.NUMBER},
    {key: "description", type: FormType.TEXTAREA},
    {
        key: "category",
        type: FormType.AutoComplete,
        options: [],
    },
    {key: "available", type: FormType.Switch, value: true},
    {key: "images", type: FormType.ImagesEditor},
];
export const category_fields: InputField[] = [
    {key: "title", type: FormType.TEXT},
    {key: "position", type: FormType.NUMBER},
];
type InputFormType = FormType.TEXT | FormType.TEXTAREA | FormType.NUMBER;

const isInputFormType = (type: FormType): type is InputFormType => {
    return (
        type === FormType.TEXT ||
        type === FormType.TEXTAREA ||
        type === FormType.NUMBER
    );
};
export const json_field_to_form_field = (json_field: InputField): FormField => {
    if (isInputFormType(json_field.type)) {
        return new FieldInput(json_field.type, json_field.key,);
    }
    if (json_field.type === FormType.Switch) {

        return new FieldInput(json_field.type, json_field.key, json_field.value);

    }

    if (json_field.type === FormType.AutoComplete) {
        return new FieldAutoComplete(
            json_field.type,
            json_field.key,
            json_field.options!,
        );
    }

    return new FieldInput(json_field.type, json_field.key);
};

export const json_fields_to_form_fields = (
    json_fields: InputField[],
): FormField[] =>
    json_fields.map((obj: InputField) => json_field_to_form_field(obj));

export const get_form_by_model = (type_form: ModelType): FormField[] => {
    switch (type_form) {
        case ModelType.product:
            return json_fields_to_form_fields([...product_fields]);
        case ModelType.category:
            return json_fields_to_form_fields([...category_fields]);
    }
};
export const array_obj_to_obj_with_key = (
    iterable: any[],
    value: any,
    key: string,
) => iterable.find((o: any) => o[key]?.toString() === value.toString());
export const create_form_fields = (
    source: FormField[],
    target: any,
): FormField[] => {
    if (
        target == null ||
        (Array.isArray(target) && target.length === 0) ||
        (typeof target === "object" && Object.keys(target).length === 0)
    )
        return source.map((field) => ({...field}));
    return source.map((field) => {
        let updatedValue = target[field.key];

        if (typeof updatedValue === "string") {
            updatedValue = updatedValue.trim();
        }
        return {...field, value: updatedValue};
    });
};

/* eslint-enable max-classes-per-file */
