<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import associationService from "@/services/associationService";
import { useNotificationStore } from "@/store/notificationStore";
import { PublicUser } from "@shared/types/user";
import { onMounted, ref } from "vue";

const props = defineProps<{
  associationId: string;
  canManageApplications: boolean;
}>();

const notificationStore = useNotificationStore();
const members = ref<PublicUser[]>([]);

const emit = defineEmits<{
  loaded: [];
}>();

const loadMembers = async () => {
  try {
    members.value = await associationService.getAssociationMembers(
      props.associationId
    );
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

const handleRemoveMember = async (userId: string) => {
  try {
    await associationService.removeMember(props.associationId, userId);
    await loadMembers();
    notificationStore.showNotification("Membre retiré avec succès", "success");
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

onMounted(() => {
  loadMembers();
});
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
  >
    <div
      v-for="member in members"
      :key="member.id"
      class="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3"
    >
      <JnsImage
        :name="`${member.first_name} ${member.last_name}`"
        :src="member.image || '/assets/users-images/default.png'"
        size="sm"
      />
      <div class="flex-grow min-w-0">
        <span class="font-medium text-gray-900 block truncate">
          {{ member.first_name }} {{ member.last_name }}
        </span>
      </div>
      <div v-if="canManageApplications">
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          size="small"
          @click="handleRemoveMember(member.id)"
          v-tooltip.left="'Retirer le membre'"
        />
      </div>
    </div>
  </div>
</template>
