function getMessageText() {
    let $message_input;
    $message_input = $('.message_input');
    return $message_input.val();
}

function onClickAsEnter(e) {
    if (e.keyCode === 13) {
        onSendButtonClicked()
    }
}

function onSendButtonClicked() {
    let message = document.getElementById("message_input").value;
    let friend = document.getElementById("character");
    let name = friend.options[friend.selectedIndex].value;
    let topic = document.getElementById("topic").value;


    if (topic == '') {
        document.getElementById('warning').innerText = 'Please fill topic!';
        return ;
    }
    get_script(message, name, topic);
    return ;
}

function get_script(message, name, topic){
    var formData = new FormData(); 
    formData.append("name", "SpongeBob" );
    formData.append("text", message);
    formData.append("length", 30);
    const url = "https://master-gpt2-spongebob-fpem123.endpoint.ainize.ai/SpongeBob";
    fetchUntilCondition(url, formData, name, 0, response => { 
        callback(response, name, message, x => {
            callback2(x, name);
        });
    });
    return ;
}

function fetchUntilCondition(url, formData, name, i, cb){
    fetch(
        url,
        {
            method: "POST",
            body: formData
        } ).then(response => {
            if (response.status == 200){
                return response;
            }
            else{
                throw Error("Failed");
            }
        })
        .then(response => response.json())
        .then(json => json['0'])
        .then(result => {
            if(result.length<2 && i<10) {
                fetchUntilCondition(url, formData, name, i+1, cb);
            }
            else if(result[1][0]!=name && i<10) {
                fetchUntilCondition(url, formData, name, i+1, cb); // fetch again
            }
            else if(i==10) {
                if(result[1][0]==name){
                    cb(result[1][1]);
                }
                else {
                    cb(0)
                };
            }
            
            else {
                cb(result[1][1]);
            }
        })
        .catch(e => cb(0));
}

function callback(response, name, message, cb) {
    if(response==0){
        var formData = new FormData(); 
        formData.append("bot_id", name );
        formData.append("text", message);
        formData.append("topic", topic);
        formData.append("agent", "dialogpt.medium");
        const url = "https://main-openchat-fpem123.endpoint.ainize.ai/send/S2lt";
        fetch(
            url,
            {
                method: "POST",
                body: formData
            }
        )
        .then(response => {
            if (response.status == 200){
                return response;
            }
            else{
                throw Error("Failed");
            }
        })
        .then(response => response.json())
        .then(json => cb(json['output']))
        .catch(e => alert(e));
    }
    else {
        cb(response);
    }

}

function callback2(message, name) {
    console.log(message);
}