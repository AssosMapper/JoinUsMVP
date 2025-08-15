<script setup lang="ts">
import JnsField from "@/components/ui/JnsField.vue";
import associationApplicationService from "@/services/associationApplicationService";
import { useNotificationStore } from "@/store/notificationStore";
import { JoinAssociationDto } from "@shared/dto/association-applications.dto";
import {
  ApplicationStatus,
  AssociationApplication,
} from "@shared/types/association-applications";
import { joinAssociationSchema } from "@shared/validations/association-applications.validation";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import { useForm } from "vee-validate";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  associationApplication?: AssociationApplication;
  applicationQuestion?: string;
  associationId: string;
  isPublic?: boolean;
}>();

const emit = defineEmits(["join:success"]);
const visible = ref(false);

const notificationStore = useNotificationStore();
const applicationQuestion = ref(props.applicationQuestion);
const associationApplication = ref<AssociationApplication | null>(
  props.associationApplication ?? null
);
watch(
  () => props.associationApplication,
  (newVal) => {
    associationApplication.value = newVal;
    setFieldValue("applicationAnswer", props.isPublic ? null : (newVal?.applicationAnswer ?? null));
  }
);
const { handleSubmit, errors, defineField, setFieldValue } =
  useForm<JoinAssociationDto>({
    validationSchema: joinAssociationSchema,
    initialValues: {
      applicationAnswer: props.isPublic 
        ? null 
        : (associationApplication.value?.applicationAnswer ?? null),
      associationId: props.associationId,
    },
  });
const isSubmitting = ref(false);

const [applicationAnswer, applicationAnswerAttrs] =
  defineField("applicationAnswer");

const onSubmit = handleSubmit(async (formValues: JoinAssociationDto) => {
  isSubmitting.value = true;

  try {
    let result = await associationApplicationService.joinAssociation({
      associationId: props.associationId,
      applicationAnswer: props.isPublic ? null : formValues.applicationAnswer,
    });

    notificationStore.showNotification(
      props.isPublic ? "Vous avez rejoint l'association avec succès" : "Candidature envoyée avec succès",
      "success"
    );
    setFieldValue("applicationAnswer", result.applicationAnswer);
    applicationQuestion.value = result.applicationQuestion;
    associationApplication.value = { ...result } as AssociationApplication;
    console.log("Association application:", associationApplication.value);
    
    // Fermer le modal automatiquement pour les associations publiques
    if (props.isPublic)
      visible.value = false;
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  } finally {
    isSubmitting.value = false;
  }
});

// Méthode pour rejoindre directement une association publique
const joinPublicAssociation = async () => {
  if (!props.isPublic) return;
  
  isSubmitting.value = true;

  try {
    let result = await associationApplicationService.joinAssociation({
      associationId: props.associationId,
      applicationAnswer: null,
    });

    notificationStore.showNotification(
      "Vous avez rejoint l'association avec succès",
      "success"
    );
    associationApplication.value = { ...result } as AssociationApplication;
    emit("join:success", associationApplication.value);

  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = async () => {
  if (associationApplication.value?.id) {
    isSubmitting.value = true;
    try {
      await associationApplicationService.cancelApplication(
        associationApplication.value.id
      );
      visible.value = false;
      associationApplication.value = null;
      setFieldValue("applicationAnswer", "");
      applicationQuestion.value = props.applicationQuestion;
      notificationStore.showNotification("Annulée avec succès", "success");
    } catch (error: any) {
      notificationStore.showNotification(error.message, "error");
    } finally {
      isSubmitting.value = false;
    }
  }
};

const sendButtonText = computed(() => {
  if (props.isPublic) {
    return "Rejoindre l'association";
  }
  if (associationApplication.value?.status === ApplicationStatus.IN_PROGRESS)
    return "Editer ma candidature";
  return "Envoyer ma candidature";
});

const showButtonText = computed(() => {
  if (props.isPublic) {
    return "Rejoindre";
  }
  if (associationApplication.value?.status === ApplicationStatus.IN_PROGRESS)
    return "Voir ma candidature";
  return "Postuler";
});
</script>

<template>
  <Button
    :label="showButtonText"
    class="bg-primary text-white"
    :loading="isSubmitting"
    @click="props.isPublic ? joinPublicAssociation() : visible = true"
  />

  <Dialog v-model:visible="visible" modal :header="props.isPublic ? 'Rejoindre l\'association' : 'Votre candidature'">
    <template #header>
      <span class="text-2xl font-semibold text-surface-950">
        {{ props.isPublic ? 'Rejoindre l\'association' : 'Votre candidature' }}
      </span>
    </template>
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <span v-if="!props.isPublic" class="text-surface-500 font-medium">{{
        applicationQuestion
      }}</span>
      
      <span v-if="props.isPublic" class="text-surface-500 font-medium">
        Cette association est publique, vous pouvez la rejoindre directement.
      </span>

      <JnsField v-if="!props.isPublic" :errorMessage="errors.applicationAnswer">
        <FloatLabel variant="in" class="w-full">
          <Textarea
            id="applicationAnswer"
            v-model="applicationAnswer"
            v-bind="applicationAnswerAttrs"
            rows="5"
            cols="30"
            class="w-full"
            :class="{ 'p-invalid': errors.applicationAnswer }"
            autoResize
          />
          <label for="applicationAnswer">Votre réponse</label>
        </FloatLabel>
      </JnsField>

      <div class="flex justify-end gap-2">
        <Button
          :loading="isSubmitting"
          v-if="
            associationApplication?.status === ApplicationStatus.IN_PROGRESS
          "
          label="Annuler ma candidature"
          text
          outlined
          severity="danger"
          @click="handleCancel"
          type="button"
        />
        <Button
          :label="sendButtonText"
          severity="primary"
          class="bg-primary text-white"
          :loading="isSubmitting"
          type="submit"
        />
      </div>
    </form>
  </Dialog>
</template>
