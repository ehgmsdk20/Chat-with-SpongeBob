function changePartner(e) {
    var partner = document.getElementById('character')
    var name = partner[partner.selectedIndex].value;
    document.getElementById('char').innerText = "Chat with "+name;
    var ul = document.getElementById("messages");
    while (ul.hasChildNodes()) { 
        ul.removeChild( ul.firstChild ); 
    }

}

function onClickAsEnter(e) {
    if (e.keyCode === 13) {
        onSendButtonClicked()
    }
}

function sendMessage(text, message_side) {
    var ul = document.getElementById("messages");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(text));
    li.classList.add("message_"+message_side);
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;

}

function onSendButtonClicked() {
    let message = document.getElementById("message_input").value;
    let friend = document.getElementById("character");
    let name = friend.options[friend.selectedIndex].value;
    let topic = document.getElementById("topic").value;


    if (topic == '') {
        document.getElementById('input_warning').innerText = 'Please fill topic!';
        return ;
    }
    else {
        document.getElementById('input_warning').innerText = '';
    }
    sendMessage(message, 'right');
    document.getElementById("message_input").value='';
    get_script(message, name, topic);
    return ;
}

function get_script(message, name, topic){
    var formData = new FormData(); 
    formData.append("name", "SpongeBob" );
    formData.append("text", message);
    formData.append("length", 50);
    const url = "https://master-gpt2-spongebob-fpem123.endpoint.ainize.ai/SpongeBob";
    fetchUntilCondition(url, formData, name, 0, response => { 
        callback(response, name, message, x => {
            callback2(x, name);
        });
    });
    return ;
}

var maxnum=5; //The max num that repeats function "fetchUntilCondition"

function fetchUntilCondition(url, formData, name, i, cb){
    fetch(
        url,
        {
            method: "POST",
            body: formData
        } ).then(response => {
            if (response.status == 200){
                document.getElementById('api_warning').innerText = '';
                return response;
            }
            else{
                throw 'Cannot access to SpongeBob API!';
            }
        })
        .then(response => response.json())
        .then(json => {
            return json['0'];
        })
        .then(result => {
            if(result.length<2 && i<maxnum) {
                fetchUntilCondition(url, formData, name, i+1, cb); // fetch again
            }
            else if(result[1][0]!=name && i<maxnum) {
                fetchUntilCondition(url, formData, name, i+1, cb); // fetch again
            }
            else if(i==maxnum) {
                if(result.length>1 && result[1][0]==name){
                    message = result[1][1].replace(/\[[^\]]*\]/g, ''); // Remove parenthesized string in script
                    cb(message);
                }
                else {
                    cb(0)
                };
            }
            
            else {
                message = result[1][1].replace(/\[[^\]]*\]/g, '');
                cb(message);
            }
        })
        .catch(e => {
            document.getElementById('api_warning').innerText = e;
            cb(0);
        });
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
    sendMessage(message, 'left');
}