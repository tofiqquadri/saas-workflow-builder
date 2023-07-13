export const NODE_SCHEMA_LIST = [
    {
        nodeIdentifier: 'f4cvkjfbnu78vc3hbdvchb',
        type: 'customNode',
        label: 'HTTP Trigger',
        icon: 'earthArrowRight',
        hasSource: false,
        hasTarget: true,
        config: {
            form: {
                isValid: false,
                controls: [
                    {
                        key: 'url',
                        elementType: 'input',
                        displayLabel: 'URL',
                        elementConfig: {
                            type: 'text',
                            placeholder: 'Source URL'
                        },
                        valid: false,
                        validation: {
                            required: true,
                            minLength: 6,
                            maxLength: 100,
                            isURL: true
                        },
                        touched: false,
                        canUpdate: true,
                        errors: [],
                        show: true
                    },
                    {
                        key: 'status',
                        elementType: 'input',
                        displayLabel: 'Status',
                        elementConfig: {
                            type: 'select',
                            multiple: false,
                            options: [
                                { value: 'active', label: 'Active' },
                                { value: 'inActive', label: 'Inactive' }
                            ]
                        },
                        valid: false,
                        validation: {
                            required: true
                        },
                        touched: false,
                        canUpdate: true,
                        errors: [],
                        show: true
                    }
                ],
                data: {
                    url: '',
                    status: ''
                }
            }
        }
    },
    {
        nodeIdentifier: '56hn5gntgnjgfhjghfjf',
        type: 'customNode',
        label: 'Signup Page',
        icon: 'shieldAccount',
        hasSource: true,
        hasTarget: true,
        config: {
            form: {
                isValid: false,
                controls: [
                    {
                        key: 'url',
                        elementType: 'input',
                        displayLabel: 'Signup URL',
                        elementConfig: {
                            type: 'text',
                            placeholder: 'Source URL'
                        },
                        valid: false,
                        validation: {
                            required: true,
                            minLength: 6,
                            maxLength: 100,
                            isURL: true
                        },
                        touched: false,
                        canUpdate: true,
                        errors: [],
                        show: true
                    },
                    {
                        key: 'status',
                        elementType: 'input',
                        displayLabel: 'Status',
                        elementConfig: {
                            type: 'select',
                            multiple: false,
                            options: [
                                { value: 'active', label: 'Active' },
                                { value: 'inActive', label: 'Inactive' }
                            ]
                        },
                        valid: false,
                        validation: {
                            required: true
                        },
                        touched: false,
                        canUpdate: true,
                        errors: [],
                        show: true
                    }
                ],
                data: {
                    url: '',
                    status: ''
                }
            }
        }
    },
    {
        nodeIdentifier: '54h5tyhntghnj5rtghnb',
        type: 'customNode',
        label: 'Redirect User',
        icon: 'navigationVarient',
        hasSource: true,
        hasTarget: false
    }
];
