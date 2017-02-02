#Plugin Template

##Basic Configuration
|Name|Type|Default Value|Description|Note|
|----|----|-------------|-----------|----|
|title|String||This title will appear above the plugin.||
|button_text|String|"Continue"|Text that will appear in place of 'Continue' on the button.||
|stimulus|String **OR** String Array||Text stimulus/stimuli that is displayed.|Provide either this or stimulus_file.|
|stimulus_file|String||File name of a JSON file containing stimuli in an array.|Look below for an example of formatting.|
|minimum_time|Number||Minimum number of milliseconds allowed for the user to continue.|If not used with `maximum_time`, then it will auto-advance without displaying the continue button.|
|maximum_time|Number||Maximum number of milliseconds allowed for the user to continue.|If not used with `minimum_time`, then it will auto-advance and display the continue button.|

###Example of `stimulus_file` contents
```
[
  "Apple...",
  "Banana...",
  "Pear..."
]
```

##Example Output
### Single Stimuli
```
[
 {
  "stimulus": "Hello World",
  "total_time": 3145,
  "first_interaction_time": 3145,
  "trial_type": "pcllab-template",
  "trial_index": 0,
  "time_elapsed": 3147,
  "internal_node_id": "0.0-0.0"
 }
]
```

### Multiple Stimulus
```
[
 {
  "stimulus": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam malesuada, felis ac dictum hendrerit, diam quam elementum arcu, non faucibus ipsum felis non dolor.",
  "total_time": 3173,
  "first_interaction_time": 3173,
  "trial_type": "pcllab-template",
  "trial_index": 0,
  "time_elapsed": 3174,
  "internal_node_id": "0.0-0.0"
 },
 {
  "stimulus": "Sed mollis, eros sed luctus efficitur, tortor dolor iaculis sem, vel finibus eros sapien et tortor. Morbi nec odio a dolor tincidunt sollicitudin.",
  "total_time": 3464,
  "first_interaction_time": 3464,
  "trial_type": "pcllab-template",
  "trial_index": 0,
  "time_elapsed": 6640,
  "internal_node_id": "0.0-0.0"
 },
 {
  "stimulus": "In mattis aliquam odio ac scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis condimentum commodo fringilla.",
  "total_time": 3428,
  "first_interaction_time": 3428,
  "trial_type": "pcllab-template",
  "trial_index": 0,
  "time_elapsed": 10069,
  "internal_node_id": "0.0-0.0"
 },
 {
  "trial_type": "pcllab-template",
  "trial_index": 0,
  "time_elapsed": 10070,
  "internal_node_id": "0.0-0.0"
 }
]
```