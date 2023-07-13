import React, { useEffect, useState } from 'react';
import styles from './NodeConfigureationPanel.module.css';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { formGenerator } from '@/shared/form-generator';
import { checkValidity } from '@/shared/utility';

function NodeConfigureationPanel({ node, onClose }) {
    const { data } = node || { data: null };
    const { label } = data || { label: '' };
    const { config } = data || { config: null };
    const { form } = config || { form: null };

    const [formConfig, setFormConfig] = useState(form);

    const checkFormValidity = (formConfig) => {
        if (formConfig?.controls) {
            const updatedControls = [...formConfig.controls];
            let data = { ...formConfig.data };

            for (let i = 0; i < updatedControls.length; i++) {
                updatedControls[i] = {
                    ...updatedControls[i],
                    valid: checkValidity(
                        data[updatedControls[i].key],
                        updatedControls[i].validation,
                        updatedControls[i].errors
                    )
                };
            }

            let isFormValid = false;
            isFormValid = updatedControls.every(
                (control) => control.valid === true
            );

            const updatedForm = {
                ...formConfig,
                controls: updatedControls,
                isValid: isFormValid
            };
            setFormConfig(updatedForm);
        } else {
            setFormConfig(formConfig);
        }
    };

    useEffect(() => {
        // setFormConfig(form);
        checkFormValidity(form);
    }, [form]);

    if (!node) {
        return null;
    }

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = [...formConfig.controls];
        let updatedDate = { ...formConfig.data };

        for (let i = 0; i < updatedControls.length; i++) {
            if (updatedControls[i].key === controlName) {
                let value = null;
                if (updatedControls[i].elementConfig.type === 'multi-select') {
                    value = event.map((option) => option.value);
                } else if (updatedControls[i].elementConfig.type === 'select') {
                    value = event.value;
                } else {
                    value = event.target.value;
                }

                updatedControls[i] = {
                    ...updatedControls[i],
                    valid: checkValidity(
                        value,
                        updatedControls[i].validation,
                        updatedControls[i].errors
                    ),
                    touched: true
                };
                updatedDate = {
                    ...updatedDate,
                    [updatedControls[i].key]: value
                };
            }
        }

        let updatedFormConfig = {
            ...formConfig,
            controls: updatedControls,
            data: updatedDate
        };

        let isFormValid = false;
        isFormValid = updatedControls.every((control) => {
            if (control.show) return control.valid === true;
            return true;
        });

        updatedFormConfig = {
            ...updatedFormConfig,
            isValid: isFormValid
        };

        setFormConfig(updatedFormConfig);
    };

    const onSubmitNodeData = () => {
        console.log(data);
        data.onUpdateNodeData(formConfig.data, node.id);
    };

    let dynamicFormUI = formConfig && (
        <>
            {formGenerator(formConfig, formConfig.data, inputChangedHandler)}

            <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded-none mr-2">
                    Cancel
                </button>
                {formConfig?.isValid && (
                    <button
                        onClick={onSubmitNodeData}
                        className={`px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-none shadow-sm hover:bg-sky-300`}>
                        Save
                    </button>
                )}
            </div>
        </>
    );

    let containerUI = (
        <div className={styles.Container}>
            <div className="flex items-center justify-between bg-white shadow p-1">
                <span>{label}</span>
                <Icon
                    path={mdiClose}
                    size={1}
                    className="cursor-pointer"
                    onClick={onClose}
                />
            </div>
            <div className={styles.Wrapper}>{formConfig && dynamicFormUI}</div>
        </div>
    );

    return containerUI;
}

export default NodeConfigureationPanel;
