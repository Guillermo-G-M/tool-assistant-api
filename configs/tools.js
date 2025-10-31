const tools = [
    {
        name: 'change_lang',
        description: 'Changes the language of the application. Supports Spanish (es) and English (en).',
        input_schema: {
            type: 'object',
            properties: {
                lang: {
                    type: 'string',
                    enum: ['es', 'en'],
                    description: 'Language code to set'
                }
            },
            required: ['lang']
        }
    },
    {
        name: 'toggle_high_contrast',
        description: 'Activates or deactivates high contrast mode in the application.',
        input_schema: {
            type: 'object',
            properties: {
                enable: {
                    type: 'boolean',
                    description: 'true to activate, false to deactivate'
                }
            },
            required: ['enable']
        }
    },
    {
        name: 'toggle_voice',
        description: 'Activates or deactivates voice functionality in the application.',
        input_schema: {
            type: 'object',
            properties: {
                enable: {
                    type: 'boolean',
                    description: 'true to activate, false to deactivate'
                }
            },
            required: ['enable']
        }
    },
    {
        name: 'search_jobs',
        description: 'Searches for jobs in the application with the specified criteria.',
        input_schema: {
            type: 'object',
            properties: {
                searchTerm: {
                    type: 'string',
                    description: 'Search term (job, company, keyword).'
                },
                location: {
                    type: 'string',
                    description: 'Search location without accentuation.'
                },
                jobType: {
                    type: 'string',
                    description: 'Job type without accentuation.'
                },
                remoteOnly: {
                    type: 'boolean',
                    description: 'Only remote jobs.'
                }
            }
        }
    },
    {
        name: 'clear_filters',
        description: 'Clears all search filters in the job search application.',
        input_schema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'cannot_perform_action',
        description: 'Used when the user requests an action that is not available in the application. Inform the user that you do not have access to that function.',
        input_schema: {
            type: 'object',
            properties: {
                requested_action: {
                    type: 'string',
                    description: 'Brief description of the action requested by the user'
                }
            },
            required: ['requested_action']
        }
    }
];

export default tools;