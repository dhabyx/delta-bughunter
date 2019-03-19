function rotateLoading(){
  $("#reload_icon").addClass("spin");
}

function stopRotateLoading(){
  $("#reload_icon").removeClass("spin");
}


$("#btn-redmine-upload").click(function(){
  if (!file) {
      fname.innerHTML = 'You did NOT record anything yet.';
      return;
  }

  rotateLoading();

  $(this).disabled = true;
  fresolutions.innerHTML = fsize.innerHTML = fduration.innerHTML = browserCache.innerHTML = '';
  $(fname).text('Upload to redmine started...');

  redmine_token = "";
  redmine_server = "";

  chrome.storage.local.get({
    redmine_server: 'http://su-servidor-redmine.com/',
    redmine_token: 'Su llave API para redmine'
  }, function (items){
    redmine_server = items.redmine_server;
    redmine_token = items.redmine_token;

    var url= redmine_server + 'uploads.json?filename='+file.name;

    // chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      console.log(url);

      $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/octet-stream',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Redmine-API-Key', redmine_token);
        },
        data: file,
        processData: false,
        success: function (data, textStatus, xhr) {
          stopRotateLoading();
          console.log('finalizada la subida');
          console.log(data.token);
          console.log(textStatus);
          console.log(xhr);
        },
        error: function (xhr, textStatus, errorThrown) {
          stopRotateLoading();
          console.log('error al subir datos');
          console.log(xhr);
          console.log(textStatus);
          console.log(errorThrown);
        }
      });

    // });
  }
  );

  // $.ajax({
  //   url: url,
  //   type: 'POST',
  //   beforeSend: function (xhr) {
  //           xhr.setRequestHeader('X-Redmine-API-Key', token);
  //       },
  //
  // });
});
