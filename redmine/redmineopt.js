
$('#save').click(function() {
  var redmine_server = $('#redmine_server').val().replace(/\s*$/,'');
  if (redmine_server.slice(-1) != '/') {
    redmine_server = redmine_server + '/';
  }
  var redmine_token = $('#redmine_token').val();

  RedmineMethods.storageSaveServerConnection({
    redmine_server: redmine_server,
    redmine_token: redmine_token
  }, function() {
    $('#status').text('Options saved');
    setTimeout(function(){
        $('#status').text('');
      }, 750);
  });

});

/******* Las funciones de acá deben ser
eliminadas de este archivo
******/

function restore_options(){
  console.log('reading data');
  chrome.storage.local.get({
    redmine_server: 'http://su-servidor-redmine.com/',
    redmine_token: 'Su llave API para redmine'
  }, function(items) {
    console.log('{server:'+items.redmine_server+', token:'+items.redmine_token+'}');
    $('#redmine_server').val(items.redmine_server);
    $('#redmine_token').val(items.redmine_token);
    redmine_server=items.redmine_server;
    redmine_token=items.redmine_token;
    getProjects();
  });
};

/**
 * load projects from redmine API,
 * this function do not have functions to use when don't
 * having access to server.
 * @param  {object} projects array of projects from API
 * @return {Null}
 */
function loadProjects(projects){
  // console.log(projects);
  var $projects_select = $('#projects');
  $projects_select.empty();

  $projects_select.append('<option value="0">Select project...</option>')

  $.each(projects, function(index, object)
  {
      $projects_select.append('<option value=' + object.id + '>' + object.name + '</option>');
  });
  loadSavedData();
};

function getProjects() {
  url = redmine_server + "projects.json?key=" + redmine_token + "&limit=100"
  console.log(url);

  $.ajax({
    url: url,
    type: 'GET',
    success: function (data, textStatus, xhr) {
      if (textStatus == "success") {
        // console.log('finalizada la carga de datos');
        // console.log(data);
        projects = data.projects;
        // console.log(projects);
        loadProjects(projects);
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      // console.log('error al cargar datos');
      // console.log(xhr);
      console.log('Error to download projects: '+textStatus);
      // console.log(errorThrown);
    }
  });
};

function loadPriorities(priorities) {
  var $priorities_select = $('#priorities');
  $priorities_select.empty();

  $priorities_select.append('<option value="">Select priority...</option>')

  $.each(priorities, function(index, object)
  {
      $priorities_select.append('<option value=' + object.id + '>' + object.name + '</option>');
  });
}

function getPriorities() {
  url = redmine_server + "enumerations/issue_priorities.json?key=" + redmine_token;
  console.log(url);

  $.ajax({
    url: url,
    type: 'GET',
    success: function (data, textStatus, xhr) {
      if (textStatus == "success") {
        // console.log('finalizada la carga de prioridades');
        // console.log(data);
        loadPriorities(data.issue_priorities);
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      // console.log('error al cargar datos');
      // console.log(xhr);
      console.log('Error to download priorities: '+textStatus);
      // console.log(errorThrown);
    }
  });
}

/**
 * Load data from chrome.storage for all data prevoiusly saved.
 * @return {null}
 */
function loadSavedData() {
  chrome.storage.local.get(null, function(items) {
    if (items['projects']) {
      console.log("CHARGE data from projects: "+items['projects']);
      $('#projects').val(items['projects']).change();
    } else {
      chrome.storag.local.set({
        projects: 0
      }, function(){
        console.log("SAVED DEFAULT data from projects");
        $('#projects').val(0);
      });
    }
  });
}

//******* Hasta acá se eleminan las funciones ***/

// $(restore_options);
$(function() {
  RedmineMethods.storageLoadServerConnection(
    HtmlManager.setServerConnection
  );
})
//document.addEventListener('DOMContentLoaded', restore_options);
