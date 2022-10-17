window.onload = function (e) {
  let link = window.location + "";
  setActive(link.split("#")[1] + "-link");
};

function setActive(id) {
  console.log(id);
  let items = document.getElementsByClassName("nav-item");
  for (let i = 0; i < items.length; i++) {
    if (items[i].id != id) {
      items[i].classList.remove("active");
    } else if (id == "undefined-link") {
      document.getElementById("home-link").classList.add("active");
    } else {
      items[i].classList.add("active");
    }
  }
}

//Adding ProductsList
window.onload = function (e) {
  PRODUCTS.forEach((product) => {
    let slider = document.getElementById("card-wrapper");
    slider.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide">
          <div class="product-card">
              <div class="badge-card">
                  <span class="material-symbols-rounded">
                      local_fire_department
                  </span>
                  Hot
              </div>
              <div class="product-tumb">
                  <img src="${product.image2}" alt="shoes" class="back">
                  <img src="${product.image1}" alt="shoes" class="front">
              </div>
              <div class="product-details">
                  <h4><a href="#!">${product.name}</a></h4>
                  <p>${product.description}</p>
                  <div class="product-bottom-details">
                      <div class="product-price">$${product.price}</div>
                      <div class="product-links">
                          <a href="#!" class="heart">
                              <span class="material-symbols-rounded">
                                  favorite
                              </span>
                          </a>
                          <a href="#!" onclick="onAddClicked('${product.id}')">
                              <div id='${"addBtn-" + product.id}' class="add">
                                  <span class="material-symbols-rounded">
                                      add_shopping_cart
                                  </span>
                                  <span>Add</span>
                              </div>
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </div>`
    );
  });
};

//Add products to cart
function onAddClicked(productId) {
  let contains = false;
  CART.forEach((product) => {
    if (product.productId == productId) {
      contains = true;
    }
  });
  if (!contains) {
    CART.push({ productId, qty: 1 });

    document.getElementById("addBtn-" + productId).innerHTML =
      '<span class="material-symbols-rounded">done_outline</span>';
    cartListChanged();
    addCartRow(productId);
    calcTotal();
  } else {
    openModal(
      "Attention!",
      "Product has already been added, go to cart to change quantity "
    );
  }
}

//Add row to cart
function addCartRow(productId) {
  PRODUCTS.forEach((product) => {
    if (productId == product.id) {
      document.getElementById("cart-products").insertAdjacentHTML(
        "beforeend",
        `<tr id="cart-row-${product.id}">
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td class="qtyInput">
                <input onchange="onQtyChange('${product.id}',${product.price},this.value)"  id="qty-${product.id}" type="number" min="1" max="10" value="1">
            </td>
            <td id="total-${product.id}">$${product.price}</td>
            <td id="rmtd">
                <div onclick="removeCartRow('${product.id}')" class="rmContainer">
                    <span class="material-symbols-rounded">
                        do_not_disturb_on
                    </span>
                </div>
            </td>
          </tr>`
      );
    }
  });
}

function removeCartRow(productId) {
  document.getElementById("cart-row-" + productId).remove();
  let clone = CART;
  CART = [];
  clone.forEach((product) => {
    if (product.productId != productId) {
      CART.push(product);
    }
  });
  document.getElementById("addBtn-" + productId).innerHTML =
    '<span class="material-symbols-rounded">add_shopping_cart</span><span>Add</span>';
  cartListChanged();
  calcTotal();
}

function calcTotal() {
  let total = 0;
  CART.forEach((cartProd) => {
    PRODUCTS.forEach((product) => {
      if (cartProd.productId == product.id) {
        total += product.price * cartProd.qty;
      }
    });
  });
  document.getElementById("allCartTotal").innerText = "$" + total.toFixed(2);
}

function onQtyChange(productId, productPrice, newValue) {
  if (newValue <= 0 || newValue > 10 || parseInt(newValue) != parseFloat(newValue)) {
    openModal("Attention!", "The amount value must be in the range of 1 to 10");
    document.getElementById("qty-" + productId).value = 1;
  } else {
    document.getElementById("total-" + productId).innerText =
      "$" + (productPrice * newValue).toFixed(2);
    CART.forEach((product) => {
      if (product.productId == productId) {
        product.qty = newValue;
      }
    });
    calcTotal();
  }
}

function cartListChanged() {
  let badge = document.getElementById("badge-cart");
  badge.innerText = CART.length;
}

function openModal(messageTitle, messageBody) {
  let modal = document.getElementById("modal");
  document.getElementById("modal-header").innerText = messageTitle;
  document.getElementById("modal-body").innerText = messageBody;

  modal.style.display = "block";

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

function sendRequest() {
  //let result = document.querySelector(".result");

  let xhr = new XMLHttpRequest();
  let url = "http://asi.isutc.ac.mz:8080/asi/show_parameters.jsp ";

  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      //result.innerHTML = this.responseText;
      console.log(this.responseText);
    }
  };

  var data = JSON.stringify(CART);

  xhr.send(data);
}
