function checkInfo(){
    const email = document.getElementById("emailID").value;
    const password = document.getElementById("password").value;

    if(password.length < 6){
        alert("Password must be at least 6 characters long");
        return false;
    }else {
        localStorage.setItem("email", email);    //email id set in local storage
        return true;
    }

}