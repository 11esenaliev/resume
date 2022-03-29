// ! CRUD
const API = "http://localhost:8001/products"
let searchValue = ""

// ! Create
let inpName = $(".inp-name")
let inpDesc = $(".inp-desc")
let inpPrice = $(".inp-price")
let inpImage = $(".inp-image")
let selectStorage = $(".select-storage")
let selectColor = $(".select-color")
let addForm = $(".add-form")

addForm.on("submit", async (event) => {
    event.preventDefault()
    let name = inpName.val().trim()
    let desc = inpDesc.val().trim()
    let price = parseInt(inpPrice.val().trim())
    let image = inpImage.val().trim()
    let storage = selectStorage.val()
    let color = selectColor.val()
    let newPhone = {
        name: name,
        desc: desc,
        price: price,
        image: image,
        storage: storage,
        color: color,
    }
    for(let key in newPhone) {
        if(!newPhone[key]) {
            alert("Fill in all the gaps!")
            return
        }
    }
    const response = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newPhone)
    })
    inpName.val("")
    inpDesc.val("")
    inpPrice.val("")
    inpImage.val("")
    selectStorage.val("")
    selectColor.val("")
    Toastify({
        text: "Successfully added",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "left", 
        stopOnFocus: true,
        style: {
          background: "green",
        }
      }).showToast();
      getProducts()
})

// ! Read
let productsList = $(".products-list")


async function getProducts() {
    const response = await fetch(`${API}?q=${searchValue}`)
    const data = await response.json()
    
    // ! pagination start
    let first = currentPage * postsPerPage - postsPerPage
    let last = currentPage * postsPerPage
    const currentProducts = data.slice(first, last)
    lastPage = Math.ceil(data.length / postsPerPage)

// ! Делаем кнопки визуально не рабочими
if (currentPage === 1) {
    prevBtn.addClass("disabled")
} else {
    prevBtn.removeClass("disabled")
}
if (currentPage === lastPage) {
    nextBtn.addClass("disabled")
} else {
    nextBtn.removeClass("disabled")
}

    // ! pagination end

    productsList.html("")
    currentProducts.forEach((item) => {
        productsList.append(`
          <div class="card m-3" style="width: 250px">
            <img src="${item.image}" class="card-img-top card-image">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text card-description">${item.desc}</p>
              <h6>Storage: ${item.storage} Gb</h6>
              <h6>Price: ${item.price} som</h6>
              <button class="btn-delete" id="${item.id}">
                <img src="https://cdn-icons.flaticon.com/png/512/484/premium/484611.png?token=exp=1648128724~hmac=cc6493b6ade96a65942b364047a65a5e">
              </button>
              <button class="btn-edit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">>
              <img src="https://cdn-icons-png.flaticon.com/512/1827/1827933.png">
              </button>
            </div>
          </div>
        `)
    })
}
getProducts()

// ! Delete
$(document).on("click", ".btn-delete", async (event) => {
    let id = event.currentTarget.id
    await fetch(`${API}/${id}`, {
        method: "DELETE",
    })
    getProducts()
    Toastify({
        text: "Successfully deleted",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
   }
      }).showToast();
      getProducts()
})


// ! Update
let editInpName = $(".edit-inp-name")
let editInpDesc = $(".edit-inp-desc")
let editInpPrice = $(".edit-inp-price")
let editInpImage = $(".edit-inp-image")
let editSelectStorage = $(".edit-select-storage")
let editSelectColor = $(".edit-select-color")
let editForm = $(".edit-form")
let editModal = $(".modal")


$(document).on("click", ".btn-edit", async (event) => {
    let id = event.currentTarget.id
    editForm.attr("id", id)
    const response = await fetch(`${API}/${id}`)
    const data = await response.json()
    editInpName.val(data.name)
    editInpDesc.val(data.desc)
    editInpPrice.val(data.price)
    editInpImage.val(data.image)
    editSelectStorage.val(data.storage)
    editSelectColor.val(data.color)
})
editForm.on("submit", async (event) => {
    event.preventDefault()
    let name = editInpName.val()
    let desc = editInpDesc.val().trim()
    let price = editInpPrice.val().trim()
    let image = editInpImage.val().trim()
    let storage = editSelectStorage.val()
    let color = editSelectColor.val()
    let editedPhone = {
        name: name,
        desc: desc,
        price: price,
        image: image,
        storage: storage,
        color: color
    }
    let id = event.currentTarget.id
    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPhone)
    })
    getProducts()
    editModal.modal("hide")
    Toastify({
        text: "Successfully edited",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to left, violet, red)"
        }
      }).showToast();
})

// ! Pagination

let prevBtn = $(".prev-btn")
let nextBtn = $(".next-btn")

let postsPerPage = 4
let currentPage = 1
let lastPage = 1

nextBtn.on("click", () => {
    if(currentPage === lastPage) {
    return
    }
    currentPage++
    getProducts()
    window.scrollTo(0, 0)
})


prevBtn.on("click", () => {
    if(currentPage === 1) {
        return
    }
    currentPage--
    getProducts()
    window.scrollTo(0, 0)
})

// ! Live search
let searchInp = $(".inp-search")

searchInp.on("input", (event) => {
    searchValue = event.target.value 
   currentPage = 1
   getProducts()
})