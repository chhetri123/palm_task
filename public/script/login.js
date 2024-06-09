$(document).ready(function () {
  axios.defaults.withCredentials = true;
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    loginUser(email, password);
  });
});

function loginUser(email, password) {
  axios
    .post("http://localhost:8000/api/v1/auth/login", { email, password })
    .then((response) => {
      if (response.data.status === "success") {
        window.location.href = "/";
      } else {
        $("#errorMsg").text(response.data.message).show();
      }
    })
    .catch((error) => {
      $("#errorMsg").text(error.response.data.message).show();
    });
}
