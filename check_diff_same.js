var new_new = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people, including people who may have missed the original post. There's no algorithm to resurface old-yet-popular posts. Instagram is not Facebook; it's Twitter without the retweet ripple effect.";

var old_old = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people. There's no algorithm to resurface old-yet-popular posts. Instagram is Twitter without the retweet ripple effect.";

var new_arr = new_new.split(/\./);
var old_arr = old_old.split(/\./);

var paragraph = [];
var non_word_match = [];

// NEED TO CHANGE FOR TIMES WHEN PARAGRAPHS HAVE DIFF # SENTENCES
function splitGraph(new_arr, old_arr) {
  new_arr.forEach(function(x) {
    var y = old_arr[new_arr.indexOf(x)];

    var old_lines = y.split(/\s/);
    var new_lines = x.split(/\s/);
    var sentence = [];

    new_lines.forEach(function(a) {
      if (a == old_lines[0]) {
        sentence.push(a);
        old_lines.splice(0, 1);
      } else {
        var new_word = "<strong>" + a + "</strong>";
        sentence.push(new_word);
      }
    })
    paragraph.push(sentence.join(" ") + ".");
  })
  paragraph.pop();
}

splitGraph(new_arr, old_arr);

document.getElementById("graf").innerHTML = paragraph.join(" ");
