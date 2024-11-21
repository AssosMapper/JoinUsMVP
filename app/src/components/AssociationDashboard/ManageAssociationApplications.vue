<script setup lang="ts">
import associationApplicationService from "@/services/associationApplicationService";
import { useNotificationStore } from "@/store/notificationStore";
import type { AssociationApplication } from "@shared/types/association-applications";
import { ApplicationStatus } from "@shared/types/association-applications";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { ref } from "vue";

const props = defineProps<{
  associationId: string;
}>();

const notificationStore = useNotificationStore();
const applications = ref<AssociationApplication[]>([]);

const updateApplicationStatus = async (
  applicationId: string,
  newStatus: ApplicationStatus
) => {
  try {
    await associationApplicationService.updateApplicationStatus(
      applicationId,
      newStatus
    );
    await loadApplications();
    const message =
      newStatus === ApplicationStatus.APPROVED
        ? "Candidature approuvée avec succès"
        : "Candidature refusée";
    notificationStore.showNotification(message, "success");
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

const loadApplications = async () => {
  try {
    const apps =
      await associationApplicationService.getApplicationsByAssociation(
        props.associationId
      );
    applications.value = apps.filter(
      (app: AssociationApplication) =>
        app.status === ApplicationStatus.IN_PROGRESS
    );
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

// Charger les applications au montage du composant
loadApplications();
</script>

<template>
  <DataTable
    :value="applications"
    :paginator="true"
    :rows="10"
    class="p-4 bg-white rounded-lg shadow"
  >
    <Column field="user.first_name" header="Prénom">
      <template #body="{ data }">
        {{ data.user.first_name }}
      </template>
    </Column>

    <Column field="user.last_name" header="Nom">
      <template #body="{ data }">
        {{ data.user.last_name }}
      </template>
    </Column>

    <Column field="applicationAnswer" header="Réponse" />

    <Column header="Actions" class="w-[200px]">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button
            icon="pi pi-check"
            severity="success"
            size="small"
            outlined
            tooltip="Approuver"
            @click="
              updateApplicationStatus(data.id, ApplicationStatus.APPROVED)
            "
          />
          <Button
            icon="pi pi-times"
            severity="danger"
            size="small"
            outlined
            tooltip="Refuser"
            @click="updateApplicationStatus(data.id, ApplicationStatus.DENIED)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
