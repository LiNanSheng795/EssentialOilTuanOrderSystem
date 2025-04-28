let products = [];
let cart = [];

// 加载产品列表
async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();
  const list = document.getElementById('product-list');

  products.forEach((product, index) => {
    const item = document.createElement('div');
    item.className = 'product-item'; // 加一个class，方便CSS控制
    item.innerHTML = `
      <div class="product-info">
        <p><strong>${product.name}</strong> (${product.capacity})</p>
        <p>产地：${product.origin} ｜ 萃取方式：${product.extraction}</p>
        <p>价格：￥${product.price}</p>
      </div>
      <div class="product-action">
        <button onclick="addToCart(${index})">加入购物车</button>
      </div>
    `;
    list.appendChild(item);
  });  
}

// 加入购物车
function addToCart(index) {
  const product = products[index];
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

// 渲染购物车
function renderCart() {
  const cartDiv = document.getElementById('cart-items');
  cartDiv.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const cartItem = document.createElement('div');
    cartItem.innerHTML = `
      <p>${item.name} - ${item.capacity} - ${item.origin} - ${item.extraction} - ￥${item.price} × ${item.qty}
      <button onclick="changeQty(${idx}, 1)">＋</button>
      <button onclick="changeQty(${idx}, -1)">－</button>
      <button onclick="removeItem(${idx})">删除</button>
      </p>
    `;
    cartDiv.appendChild(cartItem);
  });
  document.getElementById('cart-total').innerText = `总价：￥${total}`;
}

// 修改数量
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

// 删除商品
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// 提交订单
document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let orderSummary = '您的订单：\n';
    cart.forEach(item => {
        orderSummary += `${item.name} - ${item.capacity} - ${item.origin} - ${item.extraction} - ￥${item.price} × ${item.qty}\n`;
    });
    orderSummary += `\n收货人：${document.getElementById('buyer-name').value}`;
    orderSummary += `\n手机：${document.getElementById('buyer-phone').value}`;
    orderSummary += `\n地址：${document.getElementById('buyer-address').value}`;
    orderSummary += `\n${document.getElementById('cart-total').innerText}`;

    // 把总结放到textarea里
    document.getElementById('summary-text').value = orderSummary;
    document.getElementById('order-summary').style.display = 'block'; // 显示订单区块
});

function copyOrder() {
    const summaryText = document.getElementById('summary-text');
    summaryText.select();
    document.execCommand('copy');  // 老版浏览器支持
    alert('订单信息已复制到剪贴板！');
}

loadProducts();
