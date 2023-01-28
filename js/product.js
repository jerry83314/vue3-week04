const { createApp, ref, onMounted } = Vue;
let delProductModal = '';
let productModal = '';
const api_url = 'https://vue3-course-api.hexschool.io';
const api_path = 'jyue-web';

const Pagination = {
  template: `<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>`
};

createApp({
  components: { Pagination },
  setup() {
    const products = ref([]);
    const newProduct = ref({
      imagesUrl: []
    });
    const isAdd = ref(true);

    onMounted(() => {
      checkLogin();
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
      productModal = new bootstrap.Modal(document.getElementById('productModal'));
    })

    // 驗證是否登入
    function checkLogin() {
      // 取得 token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
      // headers 帶上 token
      axios.defaults.headers.common['Authorization'] = token;

      const url = 'https://vue3-course-api.hexschool.io';
      axios.post(`${url}/v2/api/user/check`)
        .then((res) => {
          // 驗證通過就取得產品
          getProduct()
        })
        .catch((err) => {
          // 驗證失敗跳轉回登入頁
          alert(err.data.message);
          location.href = './login.html';
        })
    }

    // 取得產品列表
    function getProduct() {
      axios.get(`${api_url}/v2/api/${api_path}/admin/products/all`)
        .then((res) => {
          products.value = Object.values(res.data.products);
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // 新增產品
    function addProduct() {
      axios.post(`${api_url}/v2/api/${api_path}/admin/product`, {
        data: newProduct.value
      })
        .then((res) => {
          alert('新增成功');
          // 關閉 modal
          productModal.hide();
          // 重新取得資料
          getProduct();
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // 刪除產品
    function delProduct() {
      const { id } = newProduct.value;
      axios.delete(`${api_url}/v2/api/${api_path}/admin/product/${id}`)
        .then((res) => {
          alert('刪除成功');
          // 關閉 modal
          delProductModal.hide();
          // 重新取得資料
          getProduct();
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // 更新產品
    function updateProduct() {
      const { id } = newProduct.value
      axios.put(`${api_url}/v2/api/${api_path}/admin/product/${id}`, {
        data: newProduct.value
      })
        .then((res) => {
          alert('更新成功');
          // 關閉 modal
          productModal.hide();
          // 重新取得資料
          getProduct();
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // productModal 確認
    function confirmProduct() {
      // 如果為 true 則是新增產品，反之為更新產品
      if (isAdd.value) {
        addProduct();
      } else {
        updateProduct();
      }
    }

    // 打開 modal
    function openModal(method, product) {
      if (method === 'add') {
        newProduct.value = {
          imagesUrl: []
        };
        isAdd.value = true;
        productModal.show();
      } else if (method === 'edit') {
        newProduct.value = { ...product };
        isAdd.value = false;
        productModal.show();
      } else if (method === 'delete') {
        newProduct.value = { ...product };
        delProductModal.show();
      }
    }

    return {
      newProduct,
      products,
      isAdd,
      checkLogin,
      getProduct,
      addProduct,
      delProduct,
      updateProduct,
      openModal,
      confirmProduct
    }
  }
}).mount('#app');