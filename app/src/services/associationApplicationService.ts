import { useApi } from "@/composables/useApi";
import { useApiStore } from "@/store/apiUrls.store";
import { ResponseError } from "@/types/http.types";
import { JoinAssociationDto } from "@shared/dto/association-applications.dto";

const associationApplicationService = {
  joinAssociation: async (JoinAssociationData: JoinAssociationDto) => {
    const apiStore = useApiStore();
    const { data, error } = await useApi(apiStore.associationApplications.join)
      .post(JoinAssociationData)
      .json();
    if (error.value) throw error.value as ResponseError;

    return data.value;
  },
  getCurrentApplication: async (associationId: string) => {
    const apiStore = useApiStore();
    const { data, error } = await useApi(
      apiStore.resolveUrl(apiStore.associationApplications.current, {
        associationId,
      })
    ).json();
    if (error.value) throw error.value as ResponseError;

    return data.value;
  },

  updateApplicationStatus: async (applicationId: string, status: string) => {
    const apiStore = useApiStore();
    const { data, error } = await useApi(
      apiStore.resolveUrl(apiStore.associationApplications.base, {
        id: applicationId,
      })
    )
      .patch({ status })
      .json();
    if (error.value) throw error.value as ResponseError;

    return data.value;
  },
  getApplicationsByAssociations: async (associationIds: string[]) => {
    const apiStore = useApiStore();
    const url = `${
      apiStore.associationApplications.byAssociations
    }?associationIds=${associationIds.join(",")}`;
    const { data, error } = await useApi(url).json();
    if (error.value) throw error.value as ResponseError;

    return data.value;
  },
  getApplicationsByAssociation: async (associationId: string) => {
    const apiStore = useApiStore();
    const { data, error } = await useApi(
      apiStore.resolveUrl(apiStore.associationApplications.byAssociation, {
        associationId,
      })
    ).json();
    if (error.value) throw error.value as ResponseError;

    return data.value;
  },

  getAllApplications: async () => {
    const apiStore = useApiStore();
    const { data, error } = await useApi(
      apiStore.associationApplications.all
    ).json();
    if (error.value) throw error.value as ResponseError;

    return data.value;
  },

  cancelApplication: async (applicationId: string) => {
    const apiStore = useApiStore();
    const url = apiStore.resolveUrl(apiStore.associationApplications.cancel, {
      applicationId,
    });
    const { data, error } = await useApi(url).delete().json();
    if (error.value) throw error.value as ResponseError;

    return data.value;
  },
};

export default associationApplicationService;
