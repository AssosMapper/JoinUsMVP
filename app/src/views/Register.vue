<script>
import { useRouter } from 'vue-router';
import userService from "@/services/usersService";

export default {
  name: "CreateUser",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      roleId: null,
      phone: "",
      address: "",
      zip: "",
      country: "",
      image: "",
    };
  },
  methods: {
    validatePhone(phone) {
      const phoneRegex = /^0[1-9]\d{8}$/;
      return phoneRegex.test(phone);
    },
    async handleSubmit() {
      if (!this.validatePhone(this.phone)) {
        alert("Invalid phone number format. The phone number must be 0+(de 1 a 9) + 8 chiffres.");
        return;
      }
      
      const user = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        roleId: this.roleId,
        phone: this.phone,
        address: this.address,
        zip: this.zip,
        country: this.country,
        image: this.image,
        dateCreated: new Date()
      };
      
      try {
        await userService.createUser(user);
        this.router.push('/login');
        alert("User created successfully!");
      } catch (error) {
        console.error("Error creating user:", error);
        alert("There was an error creating the user.");
      }
    },
  },
};
</script>

<template>
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-4xl" @submit.prevent="handleSubmit">
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="text-base font-semibold leading-7 text-gray-900">Create User</h2>

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">First name</label>
              <input type="text" id="first-name" v-model="firstName" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Last name</label>
              <input type="text" id="last-name" v-model="lastName" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <input type="email" id="email" v-model="email" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone</label>
              <input type="text" id="phone" v-model="phone" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <input type="password" id="password" v-model="password" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
              <input type="password" id="confirm-password" v-model="confirmPassword" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-2">
              <label for="role-id" class="block text-sm font-medium leading-6 text-gray-900">Role ID</label>
              <input type="number" id="role-id" v-model="roleId" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-2">
              <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
              <input type="text" id="address" v-model="address" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-2">
              <label for="zip" class="block text-sm font-medium leading-6 text-gray-900">ZIP / Postal code</label>
              <input type="text" id="zip" v-model="zip" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-2">
              <label for="country" class="block text-sm font-medium leading-6 text-gray-900">Country</label>
              <input type="text" id="country" v-model="country" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="col-span-full">
              <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
              <input type="text" id="image" v-model="image" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
</style>
