/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
// import { Col, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';
import FormControlError from '@/components/UI/FormControlError/FormControlError';

export const formGenerator = (formDefinition, data, inputChangedHandler) => {
    let formControls = [];

    formControls = formDefinition.controls.map((control, index) => {
        if (!control.show) {
            return null;
        }
        switch (control.elementType) {
            case 'input':
                return (
                    <div key={index}>
                        {createInputControl(
                            control,
                            data,
                            inputChangedHandler,
                            index
                        )}
                    </div>
                );
            case 'radioGroup':
                return (
                    <div key={index}>
                        {createRadioGroupControl(
                            control,
                            data,
                            inputChangedHandler,
                            index
                        )}
                    </div>
                );
            default:
                return null;
        }
    });

    return formControls;
};

const createRadioGroupControl = (control, data, inputChangedHandler, index) => {
    return (
        <div key={control.key + index}>
            <div>
                <label>{control.displayLabel}</label>
            </div>
            <div>
                {control.elementConfig.options.map((option, optIndex) => {
                    return (
                        <div
                            key={optIndex}
                            {...control.elementConfig.formGroupInput}>
                            <input
                                className="form-check-input"
                                type="radio"
                                checked={data[control.key] === option.value}
                                value={option.value}
                                onChange={(event) =>
                                    inputChangedHandler(event, control.key)
                                }
                            />
                            <input className="form-check-label" check>
                                {option.displayValue}
                            </input>
                        </div>
                    );
                })}
            </div>

            <div>
                <FormControlError
                    showErrorMessage={!control.valid && control.touched}
                    errors={control.errors}></FormControlError>
            </div>
        </div>
    );
};

const createInputControl = (control, data, inputChangedHandler, index) => {
    switch (control.elementConfig.type) {
        case 'text':
            return createTextInputControl(
                control,
                data,
                inputChangedHandler,
                index
            );
        case 'textarea':
            return createTextareaInputControl(
                control,
                data,
                inputChangedHandler,
                index
            );
        case 'select':
            return createSelectInputControl(
                control,
                data,
                inputChangedHandler,
                index
            );
        case 'multi-select':
            return createMultiSelectInputControl(
                control,
                data,
                inputChangedHandler,
                index
            );
        case 'file':
            return createFileInputControl(
                control,
                data,
                inputChangedHandler,
                index
            );
        default:
            return createDefaultInputControl(
                control,
                data,
                inputChangedHandler,
                index
            );
    }
};

const createTextInputControl = (control, data, inputChangedHandler, index) => {
    return (
        <div key={control.key + index}>
            <div className="mt-2 mb-2">
                <label htmlFor="text-input">{control.displayLabel}</label>
            </div>
            <div>
                <input
                    {...control.elementConfig}
                    value={data[control.key]}
                    onChange={(event) =>
                        inputChangedHandler(event, control.key)
                    }
                    className="input border border-black w-full"
                />
                <FormControlError
                    showErrorMessage={!control.valid && control.touched}
                    errors={control.errors}></FormControlError>
            </div>
        </div>
    );
};

const createTextareaInputControl = (
    control,
    data,
    inputChangedHandler,
    index
) => {
    return (
        <div key={control.key + index}>
            <div md="3">
                <label htmlFor="textarea-input">{control.displayLabel}</label>
            </div>
            <div>
                <input
                    type="textarea"
                    name="textarea-input"
                    id="textarea-input"
                    rows="9"
                    {...control.elementConfig}
                    value={data[control.key]}
                    onChange={(event) =>
                        inputChangedHandler(event, control.key)
                    }
                />
                <FormControlError
                    showErrorMessage={!control.valid && control.touched}
                    errors={control.errors}></FormControlError>
            </div>
        </div>
    );
};

const createSelectInputControl = (
    control,
    data,
    inputChangedHandler,
    index
) => {
    return (
        <div key={control.key + index}>
            <div>
                <label htmlFor="select">{control.displayLabel}</label>
            </div>
            <div>
                <Select
                    options={control.elementConfig.options}
                    value={control.elementConfig.options.find(
                        (option) => option.value === data[control.key]
                    )}
                    onChange={(event) =>
                        inputChangedHandler(event, control.key)
                    }
                />
            </div>
            <div>
                <FormControlError
                    showErrorMessage={!control.valid && control.touched}
                    errors={control.errors}></FormControlError>
            </div>
        </div>
    );
};

const createMultiSelectInputControl = (
    control,
    data,
    inputChangedHandler,
    index
) => {
    return (
        <div key={control.key + index}>
            <div>
                <label htmlFor="multi-select">{control.displayLabel}</label>
            </div>
            <div>
                <select
                    isMulti
                    options={control.elementConfig.options}
                    value={data[control.key].map((selectedValue) => {
                        return control.elementConfig.options.find(
                            (option) => option.value === selectedValue
                        );
                    })}
                    onChange={(event) =>
                        inputChangedHandler(event, control.key)
                    }
                />
            </div>
            <div>
                <FormControlError
                    showErrorMessage={!control.valid && control.touched}
                    errors={control.errors}></FormControlError>
            </div>
        </div>
    );
};

const createFileInputControl = (control, data, inputChangedHandler, index) => {
    return (
        <div key={control.key + index}>
            <div>
                <label htmlFor="textarea-input">{control.displayLabel}</label>
            </div>
            <div>
                <input
                    type="file"
                    name="file-input"
                    id="file-input"
                    {...control.elementConfig}
                    onChange={(event) =>
                        inputChangedHandler(event, control.key)
                    }
                />
                <FormControlError
                    showErrorMessage={!control.valid && control.touched}
                    errors={control.errors}></FormControlError>
            </div>
        </div>
    );
};

const createDefaultInputControl = (
    control,
    data,
    inputChangedHandler,
    index
) => {
    return (
        <div key={control.key + index}>
            <div>
                <label htmlFor="text-input">{control.displayLabel}</label>
            </div>
            <div>
                <input
                    {...control.elementConfig}
                    value={data[control.key]}
                    onChange={(event) =>
                        inputChangedHandler(event, control.key)
                    }
                />
                <FormControlError
                    showErrorMessage={!control.valid && control.touched}
                    errors={control.errors}></FormControlError>
            </div>
        </div>
    );
};
