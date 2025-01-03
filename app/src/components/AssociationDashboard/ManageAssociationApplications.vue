<script setup lang="ts">
import associationApplicationService from "@/services/associationApplicationService";
import { useNotificationStore } from "@/store/notificationStore";
import type { AssociationApplication } from "@shared/types/association-applications";
import { ApplicationStatus } from "@shared/types/association-applications";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/userStore";

const props = defineProps<{
  associationId: string;
}>();

const userStore = useUserStore();
console.log('Props associationId:', props.associationId);
console.log('Current association in userStore:', userStore.associationId);

const notificationStore = useNotificationStore();
const applications = ref<AssociationApplication[]>([]);

const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus
) => {
  if (!userStore.isAssociationManager) {
    notificationStore.showNotification(
      "Vous devez être gestionnaire d'association pour effectuer cette action",
      "error"
    );
    return;
  }

  try {
    console.log('Updating application status:', { applicationId, status });
    console.log('Current user permissions:', userStore.user?.roles);
    await associationApplicationService.updateApplicationStatus(
      applicationId,
      status
    );
    await loadApplications();
    notificationStore.showNotification(
      'Statut de la candidature mis à jour avec succès',
      'success'
    );
  } catch (error: any) {
    console.error('Error updating status:', error);
    notificationStore.showNotification(error.message, 'error');
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
    notificationStore.showNotification(error.message, 'error');
  }
};

onMounted(() => {
  loadApplications();
});
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
