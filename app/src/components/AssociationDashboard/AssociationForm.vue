<script setup lang="ts">
import JnsField from "@/components/ui/JnsField.vue";
import associationService from "@/services/associationService";
import typeAssociationService from "@/services/typeAssociationService";
import { useNotificationStore } from "@/store/notificationStore";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { Association } from "@shared/types/association";
import { TypeAssociations } from "@shared/types/type-associations";
import { associationSchema } from "@shared/validations/associations.validation.ts";
import { useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps<{
  association?: Association;
}>();

const emit = defineEmits<{
  saved: [Association];
}>();

const notificationStore = useNotificationStore();
const typeAssociations = ref<TypeAssociations[]>([]);
const isLoading = ref(false);

const isEditMode = computed(() => !!props.association);

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: associationSchema,
  initialValues: {
    name: props.association?.name ?? "",
    isPublic: props.association?.isPublic ?? false,
    applicationQuestion: props.association?.applicationQuestion ?? "",
    typeIds: props.association?.types?.map((type) => type.id) ?? [],
    image: props.association?.image.id ?? null,
  },
});

const [name, nameAttrs] = defineField("name");
const [isPublic, isPublicAttrs] = defineField("isPublic");
const [applicationQuestion, applicationQuestionAttrs] = defineField(
  "applicationQuestion"
);
const [typeIds, typeIdsAttrs] = defineField("typeIds");

const [image] = defineField("image");
const imageData = ref<PublicMediaDto | null>(null);

watch(imageData, (newImage) => {
  image.value = newImage?.id ?? null;
});

const loadTypeAssociations = async () => {
  try {
    typeAssociations.value =
      await typeAssociationService.getAllTypeAssociations();
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

const onSubmit = handleSubmit(async (values) => {
  console.log(values);
  try {
    isLoading.value = true;
    const savedAssociation = isEditMode.value
      ? await associationService.updateAssociation(
          props.association!.id!,
          values
        )
      : await associationService.createAssociation(values);

    notificationStore.showNotification(
      `Association ${isEditMode.value ? "modifiée" : "créée"} avec succès`,
      "success"
    );
    emit("saved", savedAssociation);
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  } finally {
    isLoading.value = false;
  }
});

onMounted(() => {
  loadTypeAssociations();
});
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">
      {{ isEditMode ? "Modifier l'association" : "Créer une association" }}
    </h2>

    <form @submit="onSubmit" class="space-y-6 max-w-2xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nom de l'association -->
        <div class="col-span-2">
          <JnsField :error-message="errors.name">
            <FloatLabel>
              <InputText
                v-model="name"
                placeholder="Nom de l'association"
                class="w-full"
                v-bind="nameAttrs"
              />
            </FloatLabel>
          </JnsField>
        </div>

        <!-- Types d'association -->
        <div class="col-span-2">
          <JnsField :error-message="errors.typeIds">
            <MultiSelect
              v-model="typeIds"
              :options="typeAssociations"
              optionLabel="name"
              optionValue="id"
              placeholder="Types d'association"
              class="w-full"
              v-bind="typeIdsAttrs"
            />
          </JnsField>
        </div>

        <!-- Toggle Accès -->
        <div
          class="col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <ToggleSwitch
              v-model="isPublic"
              :trueValue="true"
              :falseValue="false"
              v-bind="isPublicAttrs"
            />
            <span class="font-medium">
              {{ isPublic ? "Accès libre" : "Sur candidature" }}
            </span>
          </div>
          <p class="text-sm text-gray-600">
            {{
              isPublic
                ? "Tout le monde peut rejoindre"
                : "Les membres doivent postuler"
            }}
          </p>
        </div>

        <!-- Question de candidature -->
        <div v-show="!isPublic" class="col-span-2 transition-all duration-300">
          <JnsField :error-message="errors.applicationQuestion">
            <FloatLabel>
              <Textarea
                v-model="applicationQuestion"
                placeholder="Question pour les candidats"
                class="w-full"
                :autoResize="true"
                rows="3"
                v-bind="applicationQuestionAttrs"
              />
            </FloatLabel>
          </JnsField>
        </div>

        <!-- Image de l'association -->
        <div class="col-span-2 flex justify-center">
          <JnsField :error-message="errors.image">
            <UploadImage v-model="imageData" preview />
          </JnsField>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" :loading="isLoading">
          {{ isEditMode ? "Mettre à jour" : "Créer" }}
        </Button>
      </div>
    </form>
  </div>
</template>
