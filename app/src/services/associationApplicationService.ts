import { JoinAssociationDto } from '@shared/validations/association-applications.validation';
// app/src/services/associationApplicationService.ts
import { useApiStore } from "@/store/apiUrls.store";
import { useApi } from "@/composables/useApi";
import { buildUrl } from "@/utils/url.util";
const associationApplicationService = {
    joinAssociation: async (JoinAssociationData: JoinAssociationDto ) => {
        const apiStore = useApiStore();
        const {data,error} = await useApi(apiStore.associationApplications.join)
            .post(JoinAssociationData)
            .json();
        if (error.value)
            throw error.value;
        
        return data.value;
    },
    getCurrentApplication: async (associationId: string) => {
        const apiStore = useApiStore();
        const { data, error } = await useApi(
            apiStore.resolveUrl(apiStore.associationApplications.current, { associationId })
        ).json();
        if (error.value) {
            throw new Error(error.value);
        }
        return data.value;
    },

    updateApplicationStatus: async (applicationId: string, status: string) => {
        const apiStore = useApiStore();
        const { data, error } = await useApi(
            apiStore.resolveUrl(apiStore.associationApplications.updateStatus, { applicationId })
        )
            .put({ status })
            .json();
            if (error.value) {
                throw new Error(error.value);
        }
        return data.value;
    },
    getApplicationsByAssociations: async (associationIds: string[]) => {
        const apiStore = useApiStore();
        const url = `${apiStore.associationApplications.byAssociations}?associationIds=${associationIds.join(',')}`;
        const { data, error } = await useApi(url).json();
        if (error.value)
            throw error.value;

        return data.value;
    },
    getApplicationsByAssociation: async (associationId: string) => {
        const apiStore = useApiStore();
        const { data, error } = await useApi(
            apiStore.resolveUrl(apiStore.associationApplications.byAssociation, { associationId })
        ).json();
        if (error.value)
            throw new Error(error.value);

        return data.value;
    },

    getAllApplications: async () => {
        const apiStore = useApiStore();
        const { data, error } = await useApi(apiStore.associationApplications.all).json();
        if (error.value) {
            throw new Error(error.value);
        }
        return data.value;
    },

    cancelApplication: async (applicationId: string) => {
        const apiStore = useApiStore();
        const url = apiStore.resolveUrl(apiStore.associationApplications.cancel, { applicationId });
        const { data, error } = await useApi(url)
            .delete()
            .json();
        if (error.value)
            throw error.value;
        
        return data.value;
    },
};

export default associationApplicationService;