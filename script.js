var cart_products = [];
var cartAction = (function (productInfo) {
    let cartProduct = [];
    return {
        setCartProduct: function (productInfo) {
            let filterProduct = cartProduct.filter((product) => {
                return product.name == productInfo.name;
            })
            if (filterProduct.length == 0) {
                productInfo.count = 1;
                cartProduct.push(productInfo);
            } else {
                if (productInfo.action == "add") {
                    filterProduct[0].count++;
                } else if (productInfo.action == "remove") {
                    filterProduct[0].count--;
                }
            }
        },

        getCartProducts: function () {
            return cartProduct;
        },

        getProductCount: function () {
            let cartProductCount = 0;
            for (let c = 0; c < cartProduct.length; c++) {
                cartProductCount += cartProduct[c].count;
            }
            return cartProductCount;
        }
    };
})();
var StringFormat = function () {
    if (!arguments.length)
        return "";
    var str = arguments[0] || "";
    str = str.toString();
    var args = typeof arguments[0],
        args = (("string" == args) ? arguments : arguments[0]);
    [].splice.call(args, 0, 1);
    for (var arg in args)
        str = str.replace(RegExp("\\#" + arg + "\\#", "gi"), args[arg] || "");
    return str;
};
var productcart_template = `
<div class="product" >
    <div class="product_discount">#0#% off</div>
    <div class="product_image">
        <img src="#1#" />
    </div>
    <div class="product_detail">
        <p>#2#</p>
        <div>
            <div class="product_price">
                <span class="display">$#3#</span>
                <span class="actual">$#4#</span>
            </div>
            <div class="product_button">
                <button onclick="addtocart(#5#)">Add to Cart</button>
            </div>
            <div class="clear_both"></div>
        </div>
    </div>
</div>`;
var productcart_selected_template = `
<tr >
    <td class="productName"><div class="productInfo"><img src=#0#><span class="productImgCenter">#1#</span></div></td>
    <td class="productCount">
        <i class="fa fa-minus" onclick="productCountChange(#2#,'decrement')"></i>
        <input type="text" value="#4#" />
        <i class="fa fa-plus" onclick="productCountChange(#2#,'increment')"></i></td>
    <td class="price">$#3#</td>
</tr>
`;
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cart_products = JSON.parse(this.responseText).items;
            var cartWidgetHtml = "";
            for (var p = 0; p < cart_products.length; p++) {
                cartWidgetHtml += StringFormat(productcart_template, cart_products[p].discount, cart_products[p].image, cart_products[p].name, cart_products[p].price.display, cart_products[p].price.actual, `'index_${p}'`);
            }
            document.getElementById("productWidget").innerHTML = cartWidgetHtml;
        }
    };
    xhttp.open("GET", "cart_products.json", true);
    xhttp.send();
}
loadDoc();
function addtocart(index) {
    var product_index = index.split("_")[1]
    var product = cart_products[product_index];
    product.action = "add";
    cartAction.setCartProduct(product);
    renderSelectedProduct();
}

function renderSelectedProduct() {
    var selectedProducts = cartAction.getCartProducts();
    var selectedProduct_html = "",selectedProductCount = 0,productTotal = 0,productActualPrice=0,discountTotal=0;

    for (var p = 0; p < selectedProducts.length; p++) {
        selectedProduct_html += StringFormat(productcart_selected_template, selectedProducts[p].image, selectedProducts[p].name, `'index_${p}'`, (selectedProducts[p].price.actual * selectedProducts[p].count),selectedProducts[p].count );
        selectedProductCount += selectedProducts[p].count;
        productTotal += selectedProducts[p].price['display'] * selectedProducts[p].count;
        productActualPrice += selectedProducts[p].price['actual'] * selectedProducts[p].count;
        discountTotal += (selectedProducts[p].price['display'] * selectedProducts[p].count) - (selectedProducts[p].price['actual'] * selectedProducts[p].count );
    }
    
    document.getElementById("selected_product").innerHTML = selectedProduct_html;
    var countSpan = document.getElementsByClassName("selectedCount");
    for (var s = 0; s < countSpan.length; s++) {
        document.getElementsByClassName("selectedCount")[s].innerHTML = selectedProductCount;
    }
    document.getElementsByClassName("productTotal")[0].innerHTML = "$"+productTotal;
    document.getElementsByClassName("discountAmount")[0].innerHTML = "$"+discountTotal;
    document.getElementsByClassName("overallTotal")[0].innerHTML = "$"+productActualPrice;
    
}

function productCountChange(index,type) {
    var product_index = index.split("_")[1];
    var selectedProducts = cartAction.getCartProducts();
    if(type=="increment") {
        selectedProducts[product_index].count++;
    } else if(type=="decrement") {
        selectedProducts[product_index].count--;
    }
    renderSelectedProduct();
}

