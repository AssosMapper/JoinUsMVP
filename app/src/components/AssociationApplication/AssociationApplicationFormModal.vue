<script setup lang="ts">
import { ApplicationStatus, AssociationApplication } from '@/types/association-application.types';
import FloatLabel from 'primevue/floatlabel';
import { computed, onMounted, ref } from 'vue';
import associationApplicationService from '@/services/associationApplicationService';
import { useForm } from 'vee-validate';
import { JoinAssociationDto, joinAssociationSchema } from 'joinus-shared/validations/association-applications.validation';


const props = defineProps<{
  associationApplication?: AssociationApplication,
  applicationQuestion?: string,
  associationId: string
}>()


const visible = ref(false);

const { handleSubmit, resetForm, values, errors } = useForm<JoinAssociationDto>({
  validationSchema: joinAssociationSchema,
  validateOnMount: false,
  
  initialValues: {
    applicationAnswer: props.associationApplication?.applicationAnswer || '',
    associationId: props.associationId 
  }
});
const isSubmitting = ref(false);

const sendButtonText = computed(() => {
  if (props.associationApplication?.status === ApplicationStatus.IN_PROGRESS)
   return "Editer ma candidature";
  return "Envoyer ma candidature";
})

const showButtonText = computed(() => {
  if (props.associationApplication?.status === ApplicationStatus.IN_PROGRESS)
   return "Voir ma candidature";
  return "Postuler";
})

const onSubmit = handleSubmit(async (formValues: JoinAssociationDto) => {
  isSubmitting.value = true
  try {
      await associationApplicationService.joinAssociation({
        associationId: props.associationId,
        applicationAnswer: formValues.applicationAnswer
      });
    
    visible.value = false;
    resetForm();
  } catch (error) {
    console.error('Error submitting application:', error);
  }finally {
     isSubmitting.value = false
  }
});

const handleCancel = async () => {
  if (props.associationApplication?.id) {
    try {
      await associationApplicationService.cancelApplication(props.associationApplication.id);
      visible.value = false;
      resetForm();
    } catch (error) {
      console.error('Error cancelling application:', error);
    }
  }
}

</script>


<template>
  <Button :label="showButtonText" @click="visible = true" />
  
  <Dialog v-model:visible="visible" modal header="Votre candidature">
    <template #header>
      <span class="text-2xl font-semibold">Votre candidature</span>
    </template>
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <span>{{ props.applicationQuestion }}</span>
    
      <FloatLabel variant="in" class="w-full">
        <Textarea 
          id="applicationAnswer" 
          v-model="values.applicationAnswer"
          rows="5" 
          cols="30"
          class="w-full"
          :class="{ 'p-invalid': errors.applicationAnswer }"
          autoResize />
        <label for="applicationAnswer">Votre réponse</label>
      </FloatLabel>
      <small class="p-error" v-if="errors.applicationAnswer">{{ errors.applicationAnswer }}</small>
      
      <div class="flex justify-end gap-2">
        <Button :loading="isSubmitting" v-if="props.associationApplication?.status === ApplicationStatus.IN_PROGRESS"
         label="Annuler ma candidature" 
         text outlined severity="danger"
          @click="handleCancel"
           type="button" />
        <Button :label="sendButtonText" severity="primary" :loading="isSubmitting" type="submit" />
      </div>
    </form>
  </Dialog>
</template>
