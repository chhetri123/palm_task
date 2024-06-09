$(document).ready(function () {
  axios.defaults.withCredentials = true;
  $("#signupForm").submit(function (event) {
    event.preventDefault();
    const username = $("#username").val();
    const email = $("#email").val();
    const dateOfBirth = $("#dateOfBirth").val();
    const gender = $("#gender").val();
    const address = $("#address").val();
    const phone = $("#phone").val();
    const password = $("#password").val();
    const conformPassword = $("#conformPassword").val();

    if (password !== conformPassword) {
      $("#errorMsg").text("Passwords do not match").show();
      return;
    }
    signupUser({
      name: username,
      email,
      dateOfBirth,
      gender,
      address,
      phone,
      password,
      conformPassword,
    });
  });
});

function signupUser(registerData) {
  axios
    .post("http://localhost:8000/api/v1/auth/signup", registerData)
    .then((response) => {
      if (response.status === 201) {
        $("#signupSuccess").show();
        setInterval(function () {
          location.replace("/");
        }, 2000);
      }
      $("#errorMsg").hide();
    })
    .catch((error) => {
      $("#errorMsg").text(error.response.data.message).show();
      $("#signupSuccess").hide();
    });
}
