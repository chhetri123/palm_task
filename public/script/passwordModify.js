$(document).ready(function () {
  axios.defaults.withCredentials = true;
  $("#forgetPasswordFrom").submit(function (event) {
    event.preventDefault();
    const email = $("#email").val();
    forgotPassword(email);
  });

  $("#resetPasswordForm").submit(function (event) {
    event.preventDefault();
    const password = $("#password").val();
    const conformPassword = $("#conformPassword").val();
    const token = window.location.pathname.split("/")[2];
    resetPassword(password, conformPassword, token);
  });
});

function forgotPassword(email) {
  axios
    .post("http://localhost:8000/api/v1/auth/forgetPassword", { email })
    .then((response) => {
      $("#resetModal").modal("show");
      $("#resetPasswordLink").attr("href", response.data.resetURL);
    })
    .catch((error) => {
      $("#forgotError").text(error.response.data.message).show();
    });
}

function resetPassword(password, conformPassword, token) {
  axios
    .post(`http://localhost:8000/api/v1/auth/resetPassword/${token}`, {
      password,
      conformPassword,
    })
    .then(() => {
      $("#resetSuccess").show();
      setInterval(function () {
        location.replace("/login");
      }, 2000);
    })
    .catch((error) => {
      $("#resetError").text(error.response.data.message).show();
    });
}
