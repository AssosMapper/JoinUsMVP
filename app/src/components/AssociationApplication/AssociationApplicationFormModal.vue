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
import FloatLabel from "primevue/floatlabel";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";

const props = defineProps<{
  associationApplication?: AssociationApplication;
  applicationQuestion?: string;
  associationId: string;
}>();

const visible = ref(false);

const notificationStore = useNotificationStore();
const applicationQuestion = ref(props.applicationQuestion);
const associationApplication = ref<AssociationApplication | null>(
  props.associationApplication ?? null
);

const { handleSubmit, errors, defineField, setFieldValue } =
  useForm<JoinAssociationDto>({
    validationSchema: joinAssociationSchema,
    initialValues: {
      applicationAnswer:
        associationApplication.value?.applicationAnswer ?? null,
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
      applicationAnswer: formValues.applicationAnswer,
    });

    notificationStore.showNotification(
      "Candidature envoyée avec succès",
      "success"
    );
    setFieldValue("applicationAnswer", result.applicationAnswer);
    applicationQuestion.value = result.applicationQuestion;
    associationApplication.value = { ...result } as AssociationApplication;
    console.log(associationApplication.value);
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  } finally {
    isSubmitting.value = false;
  }
});

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
  if (associationApplication.value?.status === ApplicationStatus.IN_PROGRESS)
    return "Editer ma candidature";
  return "Envoyer ma candidature";
});

const showButtonText = computed(() => {
  if (associationApplication.value?.status === ApplicationStatus.IN_PROGRESS)
    return "Voir ma candidature";
  return "Postuler";
});
</script>

<template>
  <Button :label="showButtonText" class="bg-primary text-white" @click="visible = true" />

  <Dialog v-model:visible="visible" modal header="Votre candidature">
    <template #header>
      <span class="text-2xl font-semibold">Votre candidature</span>
    </template>
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <span>{{ applicationQuestion }}</span>

      <JnsField :errorMessage="errors.applicationAnswer">
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
          :loading="isSubmitting"
          type="submit"
        />
      </div>
    </form>
  </Dialog>
</template>
