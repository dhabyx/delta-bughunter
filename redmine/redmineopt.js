
$('#save').click(function() {
  var redmine_server = $('#redmine_server').val().replace(/\s*$/,'');
  if (redmine_server.slice(-1) != '/') {
    redmine_server = redmine_server + '/';
  }
  var redmine_token = $('#redmine_token').val();

  chrome.storage.local.set({
      redmine_server: redmine_server,
      redmine_token: redmine_token
    }, function() {
      console.log('{server:'+redmine_server+', token:'+redmine_token+'}');
      $('#status').text('Options saved');
      setTimeout(function(){
          $('#status').text('');
        }, 750);
    }
  );
});

function restore_options(){
  console.log('reading data');
  chrome.storage.local.get({
    redmine_server: 'http://su-servidor-redmine.com/',
    redmine_token: 'Su llave API para redmine'
  }, function(items) {
    console.log('{server:'+items.redmine_server+', token:'+items.redmine_token+'}');
    $('#redmine_server').val(items.redmine_server);
    $('#redmine_token').val(items.redmine_token);
  });
};

$(restore_options);
//document.addEventListener('DOMContentLoaded', restore_options);
