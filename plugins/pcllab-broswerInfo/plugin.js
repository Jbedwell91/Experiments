/*
* @name PCLLAB Browser Info
* @author Anirudh Manohar Chellani
*/
jsPsych.plugins['pcllab-browserInfo'] = ( function() {
    var plugin = {};
    plugin.trial = function(display_element, trial) {
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
      var clientJS = new ClientJS();
      var trial_data = {
        browser: clientJS.getBrowser() || 'undefined',
        browser_version: clientJS.getBrowserMajorVersion() || 'undefined',
        browser_engine: clientJS.getEngine() || 'undefined',
        browser_engine_version: clientJS.getEngineVersion() || 'undefined',
        os: clientJS.getOS() || 'undefined',
        os_version: clientJS.getOSVersion() || 'undefined',
        screen_current_resolution: clientJS.getCurrentResolution() || 'undefined',
        screen_available_resolution: clientJS.getAvailableResolution() || 'undefined',
        user_timeZone: clientJS.getTimeZone() || 'undefined',
        user_language: clientJS.getLanguage() || 'undefined',
        user_sys_language: clientJS.getSystemLanguage() || 'undefined',
      };
      jsPsych.finishTrial(trial_data);
    };
    return plugin;
})();
