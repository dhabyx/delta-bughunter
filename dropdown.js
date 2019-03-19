var runtimePort = chrome.runtime.connect({
    name: location.href.replace(/\/|:|#|\?|\$|\^|%|\.|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')
});

runtimePort.onMessage.addListener(function(message) {
    if (!message || !message.messageFromContentScript1234) {
        return;
    }
});

var isRecording = false;
chrome.storage.sync.get('isRecording', function(obj) {
    document.getElementById('default-section').style.display = obj.isRecording === 'true' ? 'none' : 'block';
    document.getElementById('stop-section').style.display = obj.isRecording === 'true' ? 'block' : 'none';

    isRecording = obj.isRecording === 'true';

    // auto-stop-recording
    if (isRecording === true) {
        document.getElementById('stop-recording').click();

        chrome.tabs.query({}, function(tabs) {
        var tabIds = [];
        var url = 'chrome-extension://' + chrome.runtime.id + '/video.html';
        for (var i = tabs.length - 1; i >= 0; i--) {
            if (tabs[i].url === url) {
                tabIds.push(tabs[i].id);
                chrome.tabs.update(tabs[i].id, {
                    active: true,
                    url: url
                });
                break;
            }
        }
        if (tabIds.length) {
            chrome.tabs.remove(tabIds);
        }
    });
    }
});

function saveTabUrl(){
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    var last_url = tabs[0].url;
    chrome.storage.local.set({
        last_url: last_url
      }, function() {
        console.log('{last_url:'+last_url);
      }
    );
  })
};

document.getElementById('stop-recording').onclick = function() {
    chrome.storage.sync.set({
        isRecording: 'false'
    }, function() {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            stopRecording: true,
            dropdown: true
        });
        window.close();
    });
};


$('#full-screen').append(chrome.i18n.getMessage('full_screen'));
document.getElementById('full-screen').onclick = function() {
    saveTabUrl();
    chrome.storage.sync.set({
        enableTabCaptureAPI: 'false',
        enableTabCaptureAPIAudioOnly: 'false',
        enableMicrophone: 'false',
        enableCamera: 'false',
        enableScreen: 'true',
        isRecording: 'true',
        enableSpeakers: 'false'
    }, function() {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            startRecording: true,
            dropdown: true
        });
        window.close();
    });
};

$('#selected-tab').append(chrome.i18n.getMessage('selected_tab'));
document.getElementById('selected-tab').onclick = function() {
    saveTabUrl();
    chrome.storage.sync.set({
        enableTabCaptureAPI: 'true',
        enableTabCaptureAPIAudioOnly: 'false',
        enableMicrophone: 'false',
        enableCamera: 'false',
        enableScreen: 'false',
        isRecording: 'true',
        enableSpeakers: 'false'
    }, function() {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            startRecording: true,
            dropdown: true
        });
        window.close();
    });
};

$('#microphone-screen').append(chrome.i18n.getMessage('microphone_screen'));
document.getElementById('microphone-screen').onclick = function() {
    saveTabUrl();
    chrome.storage.sync.set({
        enableTabCaptureAPI: 'false',
        enableTabCaptureAPIAudioOnly: 'false',
        enableMicrophone: 'true',
        enableCamera: 'false',
        enableScreen: 'true',
        isRecording: 'true',
        enableSpeakers: 'false'
    }, function() {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            startRecording: true,
            dropdown: true
        });
        window.close();
    });
};

document.getElementById('btn-options').onclick = function(e) {
    e.preventDefault();
    location.href = this.href;
};

$('#btn-redmine-opt').click(function(e) {
  e.preventDefault();
  location.href = this.href;
});
