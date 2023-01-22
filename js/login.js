const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const username = ref('');
    const password = ref('');

    function login() {
      const url = 'https://vue3-course-api.hexschool.io';
      const data = {
        username: username.value,
        password: password.value
      }

      axios.post(`${url}/v2/admin/signin`, data)
        .then((res) => {
          // 將token expired 存到cookie
          const { token, expired } = res.data;
          document.cookie = `loginToken=${token}; expires=${new Date(expired)};`;
          location.href = './product.html';
        })
        .catch((err) => {
          console.log(err)
        })

    }

    return {
      username,
      password,
      login
    }
  }
}).mount('#app')