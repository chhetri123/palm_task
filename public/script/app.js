$(document).ready(function () {
  axios.defaults.withCredentials = true;
  checkAuth();
  $("#userTable").on("click", "tr", function () {
    const userId = $(this).data("id");
    fetchUserDetails(userId);
  });

  $("#logoutBtn").on("click", function () {
    axios
      .get("http://localhost:8000/api/v1/auth/logout")
      .then(() => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error(error);
      });
  });

  $("#editUserBtn").on("click", function () {
    $("#userModal").modal("hide");
    let user = $(this).data("user");
    user = JSON.parse(user);
    $("#editUserModal").modal("show");
    $("#editUserName").val(user.name);
    $("#editUserDateOfBirth").val(user.dateOfBirth.split("T")[0]);
    $("#editUserGender").val(user.gender);
    $("#editUserAddress").val(user.address);
    $("#editUserPhone").val(user.phone);
    $("#saveChangesBtn").data("id", user._id);
  });

  $("#deleteUserBtn").on("click", function () {
    const id = $(this).data("id");
    deleteUser(id);
  });

  $("#saveChangesBtn").on("click", function () {
    const id = $(this).data("id");
    const name = $("#editUserName").val();
    const dateOfBirth = $("#editUserDateOfBirth").val();
    const gender = $("#editUserGender").val();
    const address = $("#editUserAddress").val();
    const phone = $("#editUserPhone").val();
    editUserData({ id, name, dateOfBirth, gender, address, phone });
  });
});

function checkAuth() {
  axios
    .get("http://localhost:8000/api/v1/auth/isAuthenticated")
    .then(() => {
      fetchUsers();
    })
    .catch(() => {
      window.location.href = "/login";
    });
}

function fetchUsers() {
  axios
    .get("http://localhost:8000/api/v1/users")
    .then((response) => {
      const users = response.data.users;
      let userRows = "";
      $("#RegisteredUsersCount").text(users.length);
      users.forEach((user) => {
        userRows += `
          <tr data-id="${user._id}">
            <td>${
              user.name.split("")[0].toUpperCase() + user.name.slice(1)
            }</td>
            <td>${user.email}</td>
            <td>${
              user.gender.split("")[0].toUpperCase() + user.gender.slice(1)
            } </td>
          </tr>
        `;
      });
      $("#userTable tbody").html(userRows);
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchUserDetails(userId) {
  axios
    .get(`http://localhost:8000/api/v1/users/${userId}`)
    .then((response) => {
      const user = response.data.user;
      $("#userInfoName").text(
        user.name.split("")[0].toUpperCase() + user.name.slice(1)
      );
      $("#userInfoEmail").text(user.email);
      $("#userInfoDateOfBirth").text(
        new Date(user.dateOfBirth).toISOString().split("T")[0]
      );
      $("#userInfoGender").text(
        user.gender.split("")[0].toUpperCase() + user.gender.slice(1)
      );
      $("#userInfoAddress").text(user.address);
      $("#userInfoPhone").text(user.phone);
      $("#userModal").modal("show");
      $("#editUserBtn").data("user", JSON.stringify(user));
      $("#deleteUserBtn").data("id", userId);
    })
    .catch((error) => {
      console.error(error);
    });
}

function editUserData({ id, name, dateOfBirth, gender, address, phone }) {
  axios
    .patch(`http://localhost:8000/api/v1/users/${id}`, {
      name,
      dateOfBirth,
      gender,
      address,
      phone,
    })
    .then(() => {
      $("#editUserModal").modal("hide");
      fetchUsers();
    })
    .catch((error) => {
      console.error(error);
    });
}

function deleteUser(id) {
  axios
    .delete(`http://localhost:8000/api/v1/users/${id}`)
    .then(() => {
      $("#userModal").modal("hide");
      fetchUsers();
    })
    .catch((error) => {
      console.error(error);
    });
}
