/**
 * Manage all redmine server methods and HTML treatment
 */

/**
 * Store URL for API
 * @type {String}
 */
var redmine_server = "http://soporte.deltatracking.com";
/**
 * Store the token used to acces to API
 * @type {String}
 */
var redmine_token = "Ingrese aca su API Token";

/**
 * @namespace {RedmineObject} RedmineObject
 * @description Object with all data stored
 *               for preferences to redmine server and
 *               projects
 * @property {String} redmine_server URL to redmine server
 * @property {String} redmine_token Private token for API connection
 */

 /**
  * afterFunction is a function that called after load data methods.
  * @name doAfterFunction
  * @function
  * @param {RedmineObject} items items Items with variables of
  */

  /**
   * callback is a function that called after execute thread of
   * a function without params.
   * @name callbacFunction
   * @function
   */


/**
 * @class HtmlManager
 *
 * Class for change and get values from HTML IDs
 * <br \>
 * set - methods that place data obtained with
 *       load-methods and set values to html IDs
 * <br \>
 * get - methods that get values from html IDs
 */

var HtmlManager = {

  /**
   * Update html with server strings connection data
   * @param  {RedmineObject} items object with server data
   */
  setServerConnection: function(items) {
    $('#redmine_server').val(items.redmine_server);
    $('#redmine_token').val(items.redmine_token);
  },

  setProjects: function(projects) {
    var $projects_select = $('#projects');
    $projects_select.empty();

    $projects_select.append('<option value="0">Select project...</option>')

    $.each(projects, function(index, object)
    {
        $projects_select.append('<option value=' + object.id + '>' + object.name + '</option>');
    });

    $("#projects").change(getAssignables);
    $("#projects").change(getTrackersAndCategories);
  }
};


/**
 * @class RedmineMethods
 * @type {Object}
 * @description Class for save and restore data from Redmine Server
 * <br /> <br />
 * All methods use references to IDs in html where
 * all values are placed or restored.
 * <br /> <br />
 * load - methods that load data from server <br />
 * save - methods that save data to server <br />
 * storageLoad - methods that load data from chrome storage <br />
 * storageSave - methods that save data to chrome storage <br />
 * recieve - methods that recieve data and save into class <br />
 */
var RedmineMethods = {


  /**
   * Load server connection strings from Chrome Storage
   *
   * @param  {doAfterFunction} afterFunction execute afterFunction
   *                            after properly load data from storage
   */
  storageLoadServerConnection: function(afterFunction = function(items){}) {
    // console.log('var0{server:'+redmine_server+', token:'+redmine_token+'}');
    chrome.storage.local.get({
      redmine_server: redmine_server,
      redmine_token: redmine_token
    }, function(items) {
      redmine_server = items.redmine_server;
      redmine_token = items.redmine_token;
      afterFunction(items);
    });
  },

  /**
   * Save all server connection values to Chrome Storage
   * @param  {RedmineObject} items              Redmine object with server data
   * @param  {callbacFunction} afterFunction    callback function executed after save data.
   */
  storageSaveServerConnection: function(items, afterFunction = function(){}) {
    chrome.storage.local.set({
        redmine_server: items.redmine_server,
        redmine_token: items.redmine_token
      }, function() {
        // console.log('{server:'+items.redmine_server+', token:'+items.redmine_token+'}');
        afterFunction();
      }
    );
  },

};
