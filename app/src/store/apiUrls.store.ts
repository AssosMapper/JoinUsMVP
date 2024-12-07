import { defineStore } from "pinia";

export const useApiStore = defineStore("api", {
  state() {
    return {
      security: {
        auth: {
          login: "/v1/auth/login",
          register: "/v1/auth/register",
          profile: "/users/me",
        },
      },
      events: {
        list: "/events",
        detail: "/events/:id",
        create: "/events",
        update: "/events/:id",
        delete: "/events/:id",
        byAssociation: "/events/by-association",
        byDate: "/events/by-date",
        byMonth: "/events/by-month",
      },
      associations: {
        list: "/associations",
        detail: "/associations/:id",
        create: "/associations",
        byName: "/associations/by-name/:name",
        my: "/associations/my/",
        members: "/associations/:id/members",
        removeMember: "/associations/:id/members/:userId",
      },
      associationApplications: {
        base: "/association-applications/:id",
        join: "/association-applications/join",
        byAssociation:
          "/association-applications/by-association/:associationId",
        byAssociations: "/association-applications/by-associations",
        all: "/association-applications",
        cancel: "/association-applications/:applicationId",
        current: "/association-applications/current/:associationId",
      },
      associationTypes: {
        list: "/type-associations",
        detail: "/type-associations/:id",
        create: "/type-associations",
      },
      typeEvents: {
        list: "/type-events",
        create: "/type-events",
        detail: "/type-events/:id",
        update: "/type-events/:id",
      },
      notifications: {
        list: "/notifications",
        delete: "/notifications/:id",
        markAsRead: "/notifications/read",
        notificationStream: "/notifications/sse",
      },
      media: {
        upload: "/v1/media/upload",
        get: "/v1/media/:id",
      },
    };
  },
  actions: {
    resolveUrl(url: string, params: Record<string, string> = {}) {
      let resolvedUrl = url;
      if (!resolvedUrl) {
        throw new Error("Url not found in the apiStore");
      }
      if (url.match(/:\w+/g) && !params) {
        throw new Error("Url has params but no params are passed");
      }
      Object.keys(params).forEach((key) => {
        resolvedUrl = resolvedUrl.replace(`:${key}`, params[key]);
      });
      return resolvedUrl;
    },
    resolveWithBaseUrl(url: string, params: Record<string, string> = {}) {
      return import.meta.env.VITE_API_BASE_URL + this.resolveUrl(url, params);
    },
  },
});
