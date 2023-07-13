import React from 'react';

const FormControlError = ({ showErrorMessage, errors }) => {
    let error = null;
    if (!showErrorMessage) {
        return error;
    }

    error = errors.map((error, erroIndex) => {
        switch (error.type) {
            case 'required':
                return (
                    <span
                        key={erroIndex}
                        className={`text-red-600 text-xs italic mt-2`}>
                        *This field is Required
                    </span>
                );
            case 'minLength':
                return (
                    <span
                        key={erroIndex}
                        className={`text-red-600 text-xs italic mt-2`}>
                        *Minimum length should be {error.minLength}
                    </span>
                );
            case 'maxLength':
                return (
                    <span
                        key={erroIndex}
                        className={`text-red-600 text-xs italic mt-2`}>
                        *Maximum length should be {error.maxLength}
                    </span>
                );
            case 'isEmail':
                return (
                    <span
                        key={erroIndex}
                        className={`text-red-600 text-xs italic mt-2`}>
                        *This field should be an Email
                    </span>
                );
            case 'isNumeric':
                return (
                    <span
                        key={erroIndex}
                        className={`text-red-600 text-xs italic mt-2`}>
                        *This field should be a Number
                    </span>
                );
            case 'isURL':
                return (
                    <span
                        key={erroIndex}
                        className={`text-red-600 text-xs italic mt-2`}>
                        *This field should be a URL
                    </span>
                );
            case 'minValue':
                return (
                    <span
                        key={erroIndex}
                        className={`text-red-600 text-xs italic mt-2`}>
                        *Minimum value should be {error.minValue}
                    </span>
                );
            case 'mime':
                return (
                    <span
                        key={erroIndex}
                        className={`text-red-600 text-xs italic mt-2`}>
                        *File Types can only be {error.mimeTypes.join(', ')}
                    </span>
                );
            default:
                return null;
        }
    });
    return error;
};

export default FormControlError;
