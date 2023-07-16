// import mime from 'mime-types';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const checkValidity = (value, rules, errors) => {
    let isValid = true;
    if (!rules) {
        return true;
    }

    errors.splice(0, errors.length);

    if (
        rules.required &&
        !(value instanceof Array
            ? value.length > 0
                ? true
                : false
            : value
            ? value instanceof File
                ? value.size > 0
                : value.trim() !== ''
            : false)
    ) {
        isValid = false;
        errors.push({ type: 'required' });
        return isValid;
    }

    if (rules.minLength && value && !(value.length >= rules.minLength)) {
        isValid = false;
        errors.push({ type: 'minLength', minLength: rules.minLength });
    }

    if (rules.maxLength && value && !(value.length <= rules.maxLength)) {
        isValid = false;
        errors.push({ type: 'maxLength', maxLength: rules.maxLength });
    }

    if (rules.minValue && !(value >= rules.minValue)) {
        isValid = false;
        errors.push({ type: 'minValue', minValue: rules.minValue });
    }

    if (rules.isEmail && !isEmail(value)) {
        isValid = false;
        errors.push({ type: 'isEmail' });
    }

    if (rules.isNumeric && !isNumeric(value)) {
        isValid = false;
        errors.push({ type: 'isNumeric' });
    }

    if (rules.isURL && !isURL(value)) {
        isValid = false;
        errors.push({ type: 'isURL' });
    }

    return isValid;
};

const isNumeric = (value) => {
    const pattern = /^\d+$/;
    return pattern.test(value);
};

export const checkDependencyRule = (formDefinition) => {
    for (let i = 0; i < formDefinition.controls.length; i++) {
        let isDependencyValid = true;

        if (
            formDefinition.controls[i].rule &&
            formDefinition.controls[i].rule.dependencyType === 'AND'
        ) {
            isDependencyValid = formDefinition.controls[
                i
            ].rule.dependencyConditions.every((dependencyCondition) => {
                switch (dependencyCondition.condition) {
                    case 'equalTo':
                        return (
                            formDefinition.data[dependencyCondition.key] ===
                            dependencyCondition.value
                        );
                    default:
                        return true;
                }
            });
        }

        if (
            formDefinition.controls[i].rule &&
            formDefinition.controls[i].rule.effect === 'SHOW'
        ) {
            formDefinition.controls[i].show = isDependencyValid;
        }
    }

    return formDefinition;
};
