<template>
  <q-page
    class="bg-light-blue-9 window-height window-width row justify-center items-center"
  >
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">MKP Mobile</h5>
      </div>

      <div class="row">
        <q-card rounded bordered class="q-pa-lg shadow-2">
          <div class="text-medium" style="font-size: 30px">Login</div>
          <q-card-section>
            <q-form @reset="onReset" class="q-gutter-md">
              <q-input
                filled
                v-model="login.username"
                label="Username"
                hint="your username"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please input Username',
                ]"
              />

              <q-input
                filled
                :type="isPwd ? 'password' : 'text'"
                v-model="login.password"
                label="Password"
                lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please type your password',
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              rounded
              type="submit"
              unelevated
              color="light-blue-9"
              size="lg"
              class="full-width"
              label="Login"
              @click="loginHandle(login)"
            >
              <!-- @click.prevent="loginButton(login)" -->
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { Notify } from "quasar";

export default {
  data() {
    return {
      login: {
        username: "",
        password: "",
      },
      isPwd: ref(true),
    };
  },
  computed: {
    //   ...mapState(useAuthStore, ["loadingAuth"]),
  },
  methods: {
    //   ...mapActions(useAuthStore, ["loginhandle"]),
    async loginHandle(login) {
      try {
        console.log(login);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 3000);

        const user = { username: "admincartenz", password: "admincartenz" };
        if (
          login.username != user.username ||
          login.password != user.password
        ) {
          Notify.create({
            position: "top",
            type: "warning",
            message: "username/password salah",
            timeout: 1250,
          });
        } else {
          localStorage.username = user.username;
          localStorage.token = "token1234";
          this.$router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.q-card {
  width: 450px;
}

.my-card {
  width: 100%;
  max-width: 400px;
}

.my-form {
  width: 100%;
  max-width: 650px;
}
.bg-hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(https://cdn.quasar.dev/img/mountains.jpg);
  /* background: url(https://cdn.quasar.dev/img/mountains.jpg) 50% 50% repeat-x; */
  background-repeat: no-repeat;
  background-size: contain;
}
.blackLayer {
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
}
</style>
