// Functionality of adding a popup when someone clicks on "Add to cart" button
// that is why we added "<%= proffesion._id %>" to anchor class and h1 id so we can map them and display pop-up for clicked addToCartBtn
console.log(12345);
let addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

// locating "-" and "+" buttons on /cart page for removing/adding items to the cart
let removeItemBtns = document.querySelectorAll('.remove');
let addItemBtns = document.querySelectorAll('.add');

// locating all buttons in the header
let headerBtns = document.querySelectorAll('.grid-container-header a');
// getting the pathname from URL to help us change the style of selected tab in the navbar
let pathname = window.location.pathname;

console.log(addToCartBtns);
addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', function() {
        // console.log(btn.classList);
        let messageID = btn.classList[1];
        // console.log(messageID);
        // let addMessage = document.getElementById()
        let addMessage = document.getElementById(`id${messageID}`);
        addMessage.style.display = 'block';
        addMessage.style.position = 'absolute';
        addMessage.style.top = '95%';
        addMessage.style.left = '0';
        addMessage.style.right = '0';
        setTimeout(function() {
            addMessage.style.display = 'none'
        }, 3000);
    })
})

removeItemBtns.forEach((btn) => {
    btn.addEventListener('click', function() {
        const itemCount = Number(btn.nextElementSibling.innerText);
        if(itemCount > 0) {
            btn.nextElementSibling.innerText = String(itemCount - 1);
        // console.log(itemCount);
        }
    })
});

addItemBtns.forEach((btn) => {
    btn.addEventListener('click', function() {
        const itemCount = Number(btn.previousElementSibling.innerText);
        btn.previousElementSibling.innerText = String(itemCount + 1);
    })
})

// change the backgroun color and text color of selected tab in the navbar
headerBtns.forEach((btn, index) => {
    if(btn.href.endsWith(pathname)) {
        btn.classList.add('on-click-a');
    } else {
        btn.classList.remove('on-click-a');
    }
    // checking if we are on the contact page, if we are then we are changing contact route to home route in footer links
    if(pathname === "/contact") {
        let footerContactLink = document.querySelector(".footer-contact-link");
        footerContactLink.href = "/home";
        footerContactLink.innerHTML = "Home";
    }
})



