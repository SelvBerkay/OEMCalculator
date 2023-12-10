// localStorage Controller
const StorageController = (function() {


  return {
    storeProduct : function(product) {
      let products;

      if(localStorage.getItem("products") === null) {
        products = [];
        products.push(product)
      } else {
       products = JSON.parse(localStorage.getItem("products"))
       products.push(product)
      }
      localStorage.setItem("products", JSON.stringify(products))
    },
    getProducts : function() {
      let products;
      if(localStorage.getItem("products")===null) {
        products = [];
      } else {
        products = JSON.parse(localStorage.getItem("products"))
      }
      return products
    },
    updateStorage : function(product) {
      let products = JSON.parse(localStorage.getItem("products"))
      products.forEach((item, index) => {
        if(item.id == product.id) {
          products.splice(index, 1, product)
        }
      })
      localStorage.setItem("products", JSON.stringify(products))
    },
    deleteStorage : function(id) {
      let products = JSON.parse(localStorage.getItem("products"))
      products.forEach((item, index) => {
        if(item.id == id) {
          products.splice(index, 1)
        }
      })
      localStorage.setItem("products", JSON.stringify(products))
    }


  }


})();



// Product Controller
const ProductController = (function() {

  // private
  class Product {
    constructor(id,name,price) {
      this.id = id
      this.name = name
      this.price = price
    }
  }

  const data = {
    products : StorageController.getProducts(),
    selectedProduct : null,
    totalPrice : 0
  }

  // public
  return {
    getProducts : function() {
      return data.products;
    },
    getData : function() {
      return data;
    },
    addProduct : function(name,price) {
      let id;

      if(data.products.length > 0 ) {
        id = data.products[data.products.length - 1].id + 1;
      }else {
        id = 1
      }

      const newProduct = new Product(id,name,parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },
    getTotal : function() {
      let total = 0;

      data.products.map(prd => {
        total += prd.price;
      })

      data.totalPrice = total
      return data.totalPrice;
    },
    getProductById : function(id) {
      let product = null
      data.products.map(prd => {
        if(prd.id == id) {
          product = prd
        }
      })
      return product;
    },
    setCurrentProduct : function(product) {
      data.selectedProduct = product;
    },
    getCurrentProduct : function() {
      return data.selectedProduct
    },
    editProduct : function(newName, newPrice) {
      let product = null;
      data.products.map(prd => {
        if(prd.id == data.selectedProduct.id) {
          prd.name = newName
          prd.price = parseFloat(newPrice)
          product = prd
        }
      })
      return product;
    },
    deleteProduct : function(product) {
      data.products.forEach((prd,index) => {
        if(prd.id == product.id) {
          data.products.splice(index, 1);
        }
      })
    }
  }


})();


// UI Controller
const UIController = (function() {

  const Selectors = {
    productList : "#item-list",
    productItemList : "#item-list tr",
    addBtn : ".addBtn",
    productName : "#productName",
    productPrice : "#productPrice",
    totalTl : "#total-tl",
    totalDollar : "#total-dollar",
    editBtn : ".editBtn",
    removeBtn : ".removeBtn",
    cancelBtn : ".cancelBtn",
    saveBtn : ".saveBtn"
  }




  return {
    createProductList : function(products) {
      let html = '';

      products.map(prd => {
        html += `
        <tr>
          <td>${prd.id}</td>
          <td>${prd.name}</td>
          <td>${prd.price} $</td>
          <td>
            <i class="far fa-edit editBtn"></i>
          </td>
        </tr>
        `
      })

      document.querySelector(Selectors.productList).innerHTML = html
    },
    getSelectors : function() {
      return Selectors;
    },
    addProduct : function(newprd) {
      let item = `
      <tr>
        <td>${newprd.id}</td>
        <td>${newprd.name}</td>
        <td>${newprd.price} $</td>
        <td>
          <i class="far fa-edit editBtn"></i>
        </td>
      </tr>
      `;

      document.querySelector(Selectors.productList).innerHTML += item;
    },
    clearInputs : function() {
      document.querySelector(Selectors.productName).value = "";
      document.querySelector(Selectors.productPrice).value = "";
    },
    clearWarnings : function() {
      const items = document.querySelectorAll(Selectors.productItemList)
      items.forEach(item => {
        if(item.classList.contains("bg-warning")) {
          item.classList.remove("bg-warning")
        }
      })
    },
    showTotal : function(total) {
      document.querySelector(Selectors.totalDollar).textContent = total;
      document.querySelector(Selectors.totalTl).textContent = total * 28,93;
    },
    addProductToForm : function() {
      const selectedProduct = ProductController.getCurrentProduct();
      document.querySelector(Selectors.productName).value = selectedProduct.name
      document.querySelector(Selectors.productPrice).value = selectedProduct.price
    },
    addingState : function() {
      UIController.clearWarnings()
      UIController.clearInputs()
      document.querySelector(Selectors.addBtn).style.display = "inline"
      document.querySelector(Selectors.saveBtn).style.display = "none"
      document.querySelector(Selectors.removeBtn).style.display = "none"
      document.querySelector(Selectors.cancelBtn).style.display = "none"
    },
    updateState: function(tr) {
      UIController.clearWarnings()
      tr.classList.add("bg-warning")
      document.querySelector(Selectors.addBtn).style.display = "none"
      document.querySelector(Selectors.saveBtn).style.display = "inline"
      document.querySelector(Selectors.removeBtn).style.display = "inline"
      document.querySelector(Selectors.cancelBtn).style.display = "inline"
    },
    updateProduct : function(product) {
      let updatedItem = null;
      let items = document.querySelectorAll(Selectors.productItemList);
      items.forEach(item => {
        if(item.classList.contains("bg-warning")) {
          item.children[1].textContent = product.name
          item.children[2].textContent = product.price + " $ "
          updatedItem = item

        }
      })
      return updatedItem
    },
    deleteProduct : function() {
      let items = document.querySelectorAll(Selectors.productItemList)
      items.forEach(item => {
        if(item.classList.contains("bg-warning")) {
          item.remove()
        }
      })
    }
  }




})();


// App Controller
const App = (function(ProductCtrl, UICtrl, StorageCtrl) {

  const UISelectors = UICtrl.getSelectors()


  // Load Event Listeners
  const loadEventListeners = function() {

    // add product event
    document.querySelector(UISelectors.addBtn).addEventListener("click", productAddSubmit);

    document.querySelector(UISelectors.productList).addEventListener("click", productEditClick)

    document.querySelector(UISelectors.saveBtn).addEventListener("click", productEdit)

    document.querySelector(UISelectors.cancelBtn).addEventListener("click", cancelUpdate)

    document.querySelector(UISelectors.removeBtn).addEventListener("click", deleteProductSubmit)
  }

  const productAddSubmit = function(e) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if(productName!=="" && productPrice!=="") {
      // add product
      const newProduct = ProductCtrl.addProduct(productName, productPrice)

      // add item to LS
      StorageCtrl.storeProduct(newProduct)

      // add item to list
      UICtrl.addProduct(newProduct)


      // get total price
      const total = ProductCtrl.getTotal()
      // show total price
      UICtrl.showTotal(total)


      // clear inputs
      UICtrl.clearInputs()

    }
    e.preventDefault();
  }

  const productEditClick = function(e) {
    if(e.target.classList.contains("editBtn")) {
      const btn = e.target
      const editProductid = btn.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent
      const product = ProductCtrl.getProductById(editProductid)
      ProductCtrl.setCurrentProduct(product)
      UICtrl.addProductToForm()
      UICtrl.updateState(btn.parentElement.parentElement)
    }
  }

  const productEdit = function(e) {
    
    const newName = document.querySelector(UISelectors.productName).value;
    const newPrice = document.querySelector(UISelectors.productPrice).value;


    const updateProduct = ProductCtrl.editProduct(newName, newPrice)
    console

    let item = UICtrl.updateProduct(updateProduct)

    const total = ProductCtrl.getTotal()

    UICtrl.showTotal(total)
    

    // Update Storage
    StorageCtrl.updateStorage(updateProduct)

    UICtrl.addingState()
    
    
    
    e.preventDefault()
  }

  const cancelUpdate = function(e) {  
    UICtrl.addingState()
    UICtrl.clearWarnings()

    e.preventDefault()
  }

  const deleteProductSubmit = function(e) {
    
    const selectedProduct = ProductCtrl.getCurrentProduct();

    ProductCtrl.deleteProduct(selectedProduct);
    UICtrl.deleteProduct();
    const total = ProductCtrl.getTotal()
    UICtrl.showTotal(total)
    UICtrl.addingState()

    // delete from LS
    StorageCtrl.deleteStorage(selectedProduct.id);

    e.preventDefault();
  }


  return {
    init : function() {
      console.log("starting app...");
      UICtrl.addingState();

      // get total price
      const total = ProductCtrl.getTotal()
      // show total price
      UICtrl.showTotal(total)

      const products = ProductCtrl.getProducts()


      UICtrl.createProductList(products)

      // load event listeners
      loadEventListeners()
    }
  }



})(ProductController, UIController, StorageController);


App.init()