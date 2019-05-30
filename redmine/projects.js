var projects = "";
var priorities = "";
var home =  "";
var my_page = "";
var number_of_issues = "";

function loadAssignables(memberships) {
  var $select = $('#assignables');
  $select.empty();

  $select.append('<option value="">Select user...</option>');
  // console.log('memberships');
  // console.log(memberships);

  $.each(memberships,function(index, object)
          {
            if('group' in object) {
              $select.append('<option value=' + object.group['id'] + '> -> ' + object.group['name'] + '</option>');
            }
            else{
              $select.append('<option value=' + object.user['id'] + '>' + object.user['name'] + '</option>');
            }
          });

}

function loadTrackers(project) {
  var $select = $('#trackers');
  $select.empty();

  $select.append('<option value="">Select tracker...</option>')

  // console.log(project);
  $.each(project['trackers'], function(index, object)
  {
      $select.append('<option value=' + object.id + '>' + object.name + '</option>');
  });
}

function loadCategories(project) {
  var $select = $('#categories');
  $select.empty();

  $select.append('<option value="">Select category...</option>')

  $.each(project['issue_categories'], function(index, object)
  {
      $select.append('<option value=' + object.id + '>' + object.name + '</option>');
  });
}

function loadSavedPriorities() {
  chrome.storage.local.get(['priorities'], function(result) {
    $('#priorities').val(result.key).change();
  });
}

function loadPriorities(priorities) {
  var $priorities_select = $('#priorities');
  $priorities_select.empty();

  $priorities_select.append('<option value="">Select priority...</option>')

  $.each(priorities, function(index, object)
  {
      $priorities_select.append('<option value=' + object.id + '>' + object.name + '</option>');
  });


}

function getTrackersAndCategories() {
  var project_id = $("#projects").val();
  if (project_id > 0) {
    url = redmine_server + "projects/" + project_id + ".json?include=trackers,issue_categories&limit=200&key=" + redmine_token;

    $.ajax({
      url: url,
      type: 'GET',
      success: function (data, textStatus, xhr) {
        if (textStatus == "success") {
          // console.log('finalizada la carga de trackers and issues categories');
          // console.log(data);
          // console.log(textStatus);
          loadTrackers(data.project);
          loadCategories(data.project);
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        // console.log('error al cargar datos');
        // console.log(xhr);
        console.log('Error charging Trackers and categories:'+textStatus);
        // console.log(errorThrown);
      }
    });
  }

}


function getAssignables() {
  var project_id = $("#projects").val();

  if (project_id > 0) {
    url = redmine_server + "projects/" + project_id + "/memberships.json?limit=200&key=" + redmine_token;
    // console.log(url);

    $.ajax({
      url: url,
      type: 'GET',
      success: function (data, textStatus, xhr) {
        if (textStatus == "success") {
          // console.log('finalizada la carga de asignables');
          // console.log(data);
          // console.log(textStatus);
          loadAssignables(data.memberships);
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        // console.log('error al cargar datos');
        // console.log(xhr);
        console.log('Error to get assignables: '+textStatus);
        // console.log(errorThrown);
      }
    });

  }

}


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

function saveProjects() {
  showSaving();
  var pr = $('#projects').val()
  chrome.storage.local.set({
    projects: pr
  }, function (result) {
    hideSaving();
    console.log("SAVE: projects saved: "+pr);
  });
}

function savePriorities() {
  showSaving();
  var priorities = $('#priorities').val();
  chrome.storage.local.set({
    priorities: priorities
  }, function (result) {
    hideSaving();
    console.log("SAVE: priorities saved: "+priorities);
  });
}

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

  $("#projects").change(getAssignables);
  $("#projects").change(getTrackersAndCategories);
  loadSavedData();
};

/**
 * load data previous to initiate the options page, and fill
 * the all the combos refered to redmine project.
 * @return {null}
 */
function loadDataRedmine(){
  // console.log('reading data');
  chrome.storage.local.get({
    redmine_server: 'http://su-servidor-redmine.com/',
    redmine_token: 'Su llave API para redmine'
  }, function(items) {
    // console.log('{server:'+items.redmine_server+', token:'+items.redmine_token+'}');
    redmine_server = items.redmine_server;
    redmine_token = items.redmine_token;
    // console.log('Local {server:'+redmine_server+', token:'+redmine_token+'}');
    getProjects();
    getPriorities();
  });
};

function loadSavedDataAtomic(items, key) {
  if (items[key]) {
    console.log("CHARGE data from "+key+": "+items[key]);
    $('#'+key).val(items[key]).change();
  } else {
    var obj = {};
    obj[key] = 0
    chrome.storag.local.set(obj, function(){
      console.log("SAVED DEFAULT data from "+key);
      $('#'+key).val(0);
    });
  }
}

/**
 * Load data from chrome.storage for all data prevoiusly saved.
 * @return {null}
 */
function loadSavedData() {
  chrome.storage.local.get(null, function(items) {
    loadSavedDataAtomic(items, 'projects');
    loadSavedDataAtomic(items, 'priorities');
  });
}

$(function () {

  // loadDataRedmine();
  // $('#projects').change(saveProjects);
  // $('#priorities').change(savePriorities);
  // getProjects();
});
