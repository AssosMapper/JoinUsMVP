import {defineStore} from "pinia";

export const useApiStore = defineStore('api', {
    state() {
        return {
            security: {
                auth: {
                    login: "/v1/auth/login",
                    register: "/v1/auth/register",
                    profile: '/users/me', 
                }
            },
            events: {
                list: "/events",
                detail: "/events/:id",
                create: "/events",
                update: '/events/:id',
                delete: '/events/:id',
                byAssociation: '/events/by-association',
                byDate: '/events/by-date',
                byMonth: '/events/by-month'  
            },
            associations: {
                list: "/associations",
                detail: "/associations/:id",
                create: "/associations",
                byName: "/associations/by-name/:name",  
            },
            associationApplications: {
                join: "/association-applications",
                current: "/association-applications/current/:associationId",
                updateStatus: "/association-applications/:applicationId/status",
                byAssociation: "/association-applications/by-association/:associationId",
                byAssociations: "/association-applications/by-associations",
                all: "/association-applications",
                cancel: "/association-applications/:applicationId/cancel",
            },
            associationTypes: {
                list: "/type-associations",
                detail: "/type-associations/:id",
                create: "/type-associations"

            },
            typeEvents: {
                list: "/type-events",
                create: "/type-events",
                detail: "/type-events/:id",
                update: "/type-events/:id",
            },
        }
    },
    actions: {
        resolveUrl(url: string, params: Record<string, string>) {
            let resolvedUrl = url;
            if (!resolvedUrl) {
                throw new Error('Url not found in the apiStore');
            }
            if (url.match(/:\w+/g) && !params) {
                throw new Error('Url has params but no params are passed');
            }
            Object.keys(params).forEach((key) => {
                resolvedUrl = resolvedUrl.replace(`:${key}`, params[key]);
            });
            return resolvedUrl;
        }
    }
});