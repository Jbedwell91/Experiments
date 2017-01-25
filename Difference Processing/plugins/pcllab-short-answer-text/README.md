#Short Answer Text

##Basic Configuration
|Name|Type|Default Value|Description|Note|
|----|----|-------------|-----------|----|
|title|String||This title will appear above the plugin.||
|button_text|String|"Continue"|Text that will appear in place of 'Continue' on the button.||
|text_title|String||Title displayed above the text.||
|text|String||Text that is displayed.||
|question|String **OR** String Array||Question(s) that are displayed.||
|text_questions_file|String||File name of a JSON file containing stimuli in an array.|Look below for an example of formatting.|
|minimum_time|Number||Minimum number of milliseconds allowed for the user to continue.|If not used with `maximum_time`, then it will auto-advance without displaying the continue button.|
|maximum_time|Number||Maximum number of milliseconds allowed for the user to continue.|If not used with `minimum_time`, then it will auto-advance and display the continue button.|
|output|String||The answers given are stored in the variable provided here.|The variable name you provide here will be stored onto the window object.|
|vertically_aligned|Boolean|If set to true, then the text will appear above the question. Otherwise, they will be displayed side-by-side.||

###Example of `text_questions_file` contents
```
{
  "text": "<h4>Lorem ipsum dolor sit amet,</h4> consectetur...",
  "questions": [
    "Question One?",
    "Question Two?",
    "What's the deal with really long questions? Am I right?"
  ]
}

```

##Example Output
### Single Question
```
[
 {
  "question": "What is the answer?",
  "answer": "Hello world.",
  "total_time": 3981,
  "first_interaction_time": 904,
  "trial_type": "pcllab-short-answer-text",
  "trial_index": 0,
  "time_elapsed": 3983,
  "internal_node_id": "0.0-0.0"
 }
]
```

### Multiple Questions
```
[
 {
  "question": "Question one.",
  "answer": "Hello",
  "total_time": 4180,
  "first_interaction_time": 893,
  "trial_type": "pcllab-short-answer-text",
  "trial_index": 0,
  "time_elapsed": 4180,
  "internal_node_id": "0.0-0.0"
 },
 {
  "question": "Question two.",
  "answer": "World",
  "total_time": 2934,
  "first_interaction_time": 473,
  "trial_type": "pcllab-short-answer-text",
  "trial_index": 0,
  "time_elapsed": 7115,
  "internal_node_id": "0.0-0.0"
 },
 {
  "trial_type": "pcllab-short-answer-text",
  "trial_index": 0,
  "time_elapsed": 7116,
  "internal_node_id": "0.0-0.0"
 }
]
```