// show Password
function showPassword(event) {
    event.target.className = "bi bi-eye-slash";
    event.target.previousElementSibling.type = "text";
    event.target.removeEventListener('click', showPassword);
    event.target.addEventListener('click', hidePassword);
}

// hide password
function hidePassword(event) {
    event.target.className = "bi bi-eye";
    event.target.previousElementSibling.type = "password";
    event.target.removeEventListener('click', hidePassword);
    event.target.addEventListener('click', showPassword);
}



// function login(event){
//     event.preventDefault()
//     let email = document.getElementById("email-signup")
//     let password = document.getElementById("password-signup")

//     axios.post(`/api/v1/signup`, {
//         email: email.value,
//         password: password.value,
//     })
//     .then(function(response) {
//         console.log("signup successfull")
//         console.log(response.data);
//         Swal.fire({
//             icon: 'success',
//             title: 'Signup Successfull',
//             timer: 1000,
//             showConfirmButton: false
//         });
//     })
//     .catch(function(error) {
//         // handle error
//         console.log(error.data);
//     })

// email.value = ""
// password.value = ""
// }