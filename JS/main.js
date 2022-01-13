var selectedRow = null;
//get form inputs and alert related to each input
let StudentNameInput = document.getElementById("inputName"),
  StudentNameParent = StudentNameInput.parentElement,
  StudentNameAlert = StudentNameParent.querySelector(".Input-alert"),
  StudentEmailInput = document.getElementById("inputEmail"),
  StudentEmailParent = StudentEmailInput.parentElement,
  StudentEmailAlert = StudentEmailParent.querySelector(".Input-alert"),
  StudentAgeInput = document.getElementById("inputAge"),
  StudentAgeParent = StudentAgeInput.parentElement,
  StudentAgeAlert = StudentAgeParent.querySelector(".Input-alert"),
  StudentClassInput = document.getElementById("inputClass"),
  StudentClassParent = StudentClassInput.parentElement,
  StudentClassAlert = StudentClassParent.querySelector(".Input-alert"),
  //get student table
  StudentTBL = document.getElementById("StudentList"),
  //get Form elemnts
  myForm = document.getElementById("myForm"),
  AddBtn = document.getElementById("AddBtn"),
  UpdateBtn = document.getElementById("UpdateBtn"),
  UpdateBlock = document.getElementById("UpdateBlock"),
  searchInput = document.getElementById("searchInput"),
  //get inputs values
  NameVal,
  EmailVal,
  AgeVal,
  ClassVal;

//Check data in local storage
if (localStorage.getItem("studentsData") != null) {
  var studentsList = JSON.parse(localStorage.getItem("studentsData"));
} else {
  var studentsList = [];
}

GetStudentsFromLocalStorage();

function GetStudentsFromLocalStorage() {
  var StudentsRows = "";
  for (var i = 0; i < studentsList.length; i++) {
    StudentsRows += `<tr><td>${studentsList[i].inputName}</td>
    <td>${studentsList[i].inputAge}</td>
    <td>${studentsList[i].inputEmail}</td>
    <td>${studentsList[i].inputClass}</td>
    <td>${studentsList[i].CreationDate}</td>
    <td><a onClick="onEdit(this)" class="btn btn-warning">Edit</a>
    <a onClick="onDelete(this)" class="btn btn-danger">Delete</a></td></tr>`;
  }

  StudentTBL.getElementsByTagName("tbody")[0].innerHTML = StudentsRows;
}

function onFormAdd() {
  if (Validate()) {
    var formData = ReadFormData();
    InsertNewRowToTbl(formData);
    studentsList.push(formData);
    UpdateStorage(studentsList);
    $.ajax({
      url: "https://api.apispreadsheets.com/data/dg4RR5PJTQtHCktj/",
      type: "post",
      data: formData,
      success: function () {
        $("#CorrectIcon").css("display", "inline");
        $("#WrongIcon").css("display", "none");
      },
      error: function () {
        $("#WrongIcon").css("display", "inline");
        $("#CorrectIcon").css("display", "none");
      },
    });
  } else {
    alert("Invalid !!");
  }
}
function onFormCancel() {
  AddBtn.style.display = "block";
  UpdateBlock.style.display = "none";
  GetStudentsFromLocalStorage();
  ClearForm();
  ClearValidatateInput();
}

function updateStudentData(index) {
  if (Validate()) {
    studentsList[index].inputName = StudentNameInput.value;
    studentsList[index].inputAge = StudentAgeInput.value;
    studentsList[index].inputEmail = StudentEmailInput.value;
    studentsList[index].inputClass = StudentClassInput.value;
    UpdateStorage(studentsList);
    AddBtn.style.display = "block";
    UpdateBlock.style.display = "none";
    GetStudentsFromLocalStorage();
    ClearForm();
    ClearValidatateInput();
  } else {
    alert("Invalid !!");
  }
}

function UpdateStorage(List) {
  localStorage.setItem("studentsData", JSON.stringify(List));
}

function Validate() {
  let IsValid = false;
  if (
    ValidatateInputName() &&
    ValidatateInputEmail() &&
    ValidatateInputAge() &&
    ValidateStudentClass()
  ) {
    IsValid = true;
  } else {
    IsValid = false;
  }

  return IsValid;
}
function ReadFormData() {
  return (formData = {
    inputName: StudentNameInput.value,
    inputAge: StudentAgeInput.value,
    inputEmail: StudentEmailInput.value,
    inputClass: StudentClassInput.value,
    CreationDate: GetCurrentDate(),
  });
}

function InsertNewRowToTbl(data) {
  var table = StudentTBL.getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(table.length);
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.inputName;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.inputAge;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.inputEmail;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.inputClass;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = GetCurrentDate();
  cell6 = newRow.insertCell(5);
  cell6.innerHTML = `<a onClick="onEdit(this)" class="btn btn-warning">Edit</a>
                       <a onClick="onDelete(this)" class="btn btn-danger">Delete</a>`;
  ClearForm();
  ClearValidatateInput();
}

function onEdit(e) {
  row = e.parentElement.parentElement;
  StudentNameInput.value = studentsList[row.rowIndex - 1].inputName;
  StudentAgeInput.value = studentsList[row.rowIndex - 1].inputAge;
  StudentEmailInput.value = studentsList[row.rowIndex - 1].inputEmail;
  StudentClassInput.value = studentsList[row.rowIndex - 1].inputClass;
  AddBtn.style.display = "none";
  UpdateBlock.style.display = "flex";
  UpdateBtn.setAttribute(
    "onclick",
    `event.preventDefault();updateStudentData(${row.rowIndex - 1});`
  );
}

function onDelete(e) {
  row = e.parentElement.parentElement;
  studentsList.splice(row.rowIndex - 1, 1);
  UpdateStorage(studentsList);
  GetStudentsFromLocalStorage();
}

function ClearForm() {
  StudentNameInput.value = "";
  StudentAgeInput.value = "";
  StudentEmailInput.value = "";
  StudentClassInput.value = "";
}
/*********************** Validation  ********************/
// events for input name
StudentNameInput.addEventListener("keyup", ValidatateInputName);
StudentNameInput.addEventListener("blur", ClearValidatateInput);

function ValidatateInputName() {
  NameVal = StudentNameInput.value;

  if (NameVal.match(/\d+/g) || NameVal.length < 5) {
    StudentNameAlert.classList.remove("d-none");
    StudentNameInput.classList.add("is-invalid");
    StudentNameInput.classList.remove("is-valid");
    StudentNameAlert.innerText = "";

    if (NameVal.match(/\d+/g)) {
      StudentNameAlert.innerText += "Name Shouldn't contain numbers !";
    }
    if (NameVal.length < 5) {
      StudentNameAlert.innerText += "Name Should be at least 5 characters !";
    }
    return false;
  }

  StudentNameInput.classList.add("is-valid");
  StudentNameInput.classList.remove("is-invalid");
  StudentNameAlert.classList.add("d-none");
  return true;
}

function ClearValidatateInput() {
  NameVal = StudentNameInput.value;
  EmailVal = StudentEmailInput.value;
  AgeVal = StudentAgeInput.value;
  ClassVal = StudentClassInput.value;
  if (NameVal == "") {
    StudentNameInput.classList.remove("is-valid");
    StudentNameInput.classList.remove("is-invalid");
    StudentNameAlert.classList.add("d-none");
  }
  if (EmailVal == "") {
    StudentEmailInput.classList.remove("is-valid");
    StudentEmailInput.classList.remove("is-invalid");
    StudentEmailAlert.classList.add("d-none");
  }
  if (AgeVal == "") {
    StudentAgeInput.classList.remove("is-valid");
    StudentAgeInput.classList.remove("is-invalid");
    StudentAgeAlert.classList.add("d-none");
  }
  if (ClassVal == "") {
    StudentClassInput.classList.remove("is-valid");
    StudentClassInput.classList.remove("is-invalid");
    StudentClassAlert.classList.add("d-none");
  }
}

function GetCurrentDate() {
  var date = new Date(),
    year = date.getFullYear(),
    month =
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1),
    day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate(),
    hours = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours(),
    minutes =
      date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes(),
    seconds =
      date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds(),
    now =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
  return now;
}
//events for Email input
StudentEmailInput.addEventListener("keyup", ValidatateInputEmail);
StudentEmailInput.addEventListener("blur", ClearValidatateInput);

function ValidatateInputEmail() {
  EmailVal = StudentEmailInput.value;
  if (validateEmail(EmailVal)) {
    StudentEmailInput.classList.add("is-valid");
    StudentEmailInput.classList.remove("is-invalid");
    StudentEmailAlert.classList.add("d-none");
    return true;
  }
  StudentEmailInput.classList.remove("is-valid");
  StudentEmailInput.classList.add("is-invalid");
  StudentEmailAlert.classList.remove("d-none");
  return false;
}

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

//events for Age input
StudentAgeInput.addEventListener("keyup", ValidatateInputAge);
StudentAgeInput.addEventListener("blur", ClearValidatateInput);
function ValidatateInputAge() {
  AgeVal = StudentAgeInput.value;
  var integer = parseInt(AgeVal, 10);

  if (integer < 5 || integer > 25) {
    StudentAgeInput.classList.add("is-invalid");
    StudentAgeInput.classList.remove("is-valid");
    StudentAgeAlert.classList.remove("d-none");
    return false;
  }
  StudentAgeInput.classList.remove("is-invalid");
  StudentAgeInput.classList.add("is-valid");
  StudentAgeAlert.classList.add("d-none");
  return true;
}
//events for Class input
StudentClassInput.addEventListener("change", ValidateStudentClass);
function ValidateStudentClass() {
  ClassVal = StudentClassInput.value;
  if (ClassVal == "") {
    StudentClassInput.classList.remove("is-valid");
    StudentClassInput.classList.add("is-invalid");
    StudentClassAlert.classList.remove("d-none");
    return false;
  }
  StudentClassInput.classList.add("is-valid");
  StudentClassInput.classList.remove("is-invalid");
  StudentClassAlert.classList.add("d-none");
  return true;
}
/* Handle real time Search */
function SearchInTBL() {
  var searchedWord = searchInput.value.toLowerCase();
  //var trs = "";
  var tr = StudentTBL.getElementsByTagName("tr");

  // Loop through all table rows,
  for (i = 0; i < tr.length; i++) {
    td1 = tr[i].getElementsByTagName("td")[0];
    td2 = tr[i].getElementsByTagName("td")[1];
    td3 = tr[i].getElementsByTagName("td")[2];
    if (td1 && td2) {
      if (
        td1.innerText.toLowerCase().indexOf(searchedWord) > -1 ||
        td2.innerText.toLowerCase().indexOf(searchedWord) > -1 ||
        td3.innerText.toLowerCase().indexOf(searchedWord) > -1 //show if search match student name or email or Age
      ) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none"; //hide who don't match the search
      }
    }
  }
}
