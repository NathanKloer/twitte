(function () {

    //user: 3 users with First Name, Last Name, and Username

    //user can login, post message, edit messages, delete messages.
    //login is prompted upon landing on site.

    //user
    //-logs in
    //-posts and UI display
    //-can post/edit/delete
    //-calls for post/edit/delete are made over AJAX to firebase

    //take login information

    //AJAX call checks username vs database

    let firebaseUrlUser = "https://twitte-5e9b0.firebaseio.com/users/"
    let firebaseUrlTwitte = "https://twitte-5e9b0.firebaseio.com/posts/"
    let jsonExt = ".json"


    let userLoggedIn = ""
    let totalPosts = " "
    let hideTarget = " "
    let $login = $("#loginBtn");
    let $post = $("#postBtn")
    let $msgBin = $("#readMsgBox")
    let $postText = $("#postText")
    var login = () => {
        $.ajax({
            type: "GET",
            url: `${firebaseUrlUser}${jsonExt}`,
            success: function (data) {
                var user = prompt("Log in using your first and last name", "Smudge Cat");
                userLoggedIn = "";
                $msgBin.empty();
                let promise = new Promise((resolve, reject) => {
                    for (let i = 0; i < 3; i++) {
                        if (user === data[i].firstName + " " + data[i].lastName) {
                            $login.html(data[i].userName)
                            userLoggedIn = data[i].userName;
                            callFirebase();
                        }
                        console.log(user)

                    }
                    if (userLoggedIn === "") {
                        resolve(
                            alert("That User Does Not Exist!"),
                            console.log("this is inside the statement " + data[i].firstName + " " + data[i].lastName)
                            // console.log("this is inside second if statement " + data[i].firstName + " " + data[i].lastName)
                        )
                    }
                    // else {
                    //     reject(

                    //     )
                    // }
                });
                // var resolve = () => {

                // }
                // if (data[i].firstName + " " + data[i].lastName) {
                //     console.log("this is inside second if statement " + data[i].firstName + " " + data[i].lastName)
                // } else {
                //     alert("That User Does Not Exist!");
                //     console.log("this is inside the ELSE statement " + data[i].firstName + " " + data[i].lastName)
                // }
                promise.then((noUser) => {
                    noUser
                    $login.html("Login / Change User")
                }).catch((noUser) => {
                    console.log("error: this is in the error " + noUser)
                    $login.html("Login / Change User")
                })
            }

            // error: function (error) {
            //     console.log("There was an error. Read " + error)
            // }
        });
    }
    login();

    var callFirebase = () => {
        $.ajax({
            type: "GET",
            url: `${firebaseUrlTwitte}${jsonExt}`,
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    totalPosts = data.length
                    if (data[i] == null) {
                        continue
                    } else {
                        console.log(data[i] + " inside")
                        hideTarget = data[i].id
                        console.log(hideTarget + " this is the ID")
                        $msgBin.prepend(
                            `<article id="${data[i].user}" class="${data[i].id}">
                    <div class="flexbox">
                        <h2 class="postedBy">
                            ${data[i].user}
                        </h2>
                        <div id="timestamp">
                            ${Date.now()}
                        </div>
                        <options id="${data[i].id}" data-hideValue="${data[i].user}" class="dropdown">
                            <p>...</p>
                            <div class="dropdown-content">
                                <p id="editBtn\">edit</p>
                                <p id="deleteBtn" class"${data[i].user}">
                                    delete
                                </p>
                            </div>
                        </options>
                    </div>
                    <p id="insertedText">
                        ${data[i].text}
                    </p>
                </article>`
                        )
                        $(`#${hideTarget}`).hide();
                        if (data[i].user == userLoggedIn) {
                            $(`#${hideTarget}`).show();
                        }

                        let $thisArticleId = $("article").attr("id");
                        console.log($thisArticleId + " this is the Article ID aka User")
                        let dataUser = data[i].user
                        let $deleteText = $("#deleteBtn")

                        $deleteText.click(function () {
                            let $deleteKey = $(this).parent().parent().attr("id");
                            console.log($deleteKey + " this should be the delete key aka Post #")
                            x($deleteKey, $thisArticleId);
                        });

                    };
                }
            },
            error: function (error) {
                console.log("There was an error. Read " + error)
            }

        });
        console.log("callFirebase() ran")
    }

    var x = ($deleteKey, $thisArticleId) => {
        console.log($deleteKey)
        $.ajax({
            url: `${firebaseUrlTwitte}${$deleteKey}${jsonExt}`,
            type: "DELETE",
            success: function (data) {
                if ($thisArticleId == userLoggedIn) {
                    console.log(`${firebaseUrlTwitte}${$deleteKey}${jsonExt}`)
                    console.log($deleteKey + ' data was deleted');
                    $msgBin.empty();
                    callFirebase();
                }
            },
            error: (error) => {
                console.log(error);
            },
            // }
        });
    };

    $post.click(function () {
        $.ajax({
            type: "PATCH",
            url: `${firebaseUrlTwitte}${totalPosts}${jsonExt}`,
            datatype: "/posts/",
            data: JSON.stringify({
                "id": totalPosts,
                "text": $postText.val(),
                "time": Date.now(),
                "user": userLoggedIn
            }),
            success: (data) => {
                console.log(data + " success, new data added");
                totalPosts++
                $msgBin.empty();
                callFirebase();
            },
            error: (error) => {
                console.log("There was an error. Read " + error)
            }
        });

    });

    $login.click(function () {
        login();
    });
})();