var new_new = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people, including people who may have missed the original post. There's no algorithm to resurface old-yet-popular posts. Instagram is not Facebook; it's Twitter without the retweet ripple effect.";

var old_old = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people. There's no algorithm to resurface old-yet-popular posts. Instagram is Twitter without the retweet ripple effect.";

function grafArr(graf) {
  var graf_arr = graf.split(/\./);
  graf_arr.pop();
  return graf_arr;
}

var new_arr = grafArr(new_new);
var old_arr = grafArr(old_old);

function splitGraph(new_arr, old_arr) {
  var paragraph = [];

  new_arr.forEach(function(new_sent) {
    var old_sent = old_arr[new_arr.indexOf(new_sent)];

    var old_sent_arr = old_sent.split(/\s/);
    var new_sent_arr = new_sent.split(/\s/);
    var sentence = [];

    new_sent_arr.forEach(function(word) {
      if (word == old_sent_arr[0]) {
        sentence.push(word);
        old_sent_arr.splice(0, 1);
      } else {
        var new_word = "<strong>" + word + "</strong>";
        sentence.push(new_word);
      }
    })
    paragraph.push(sentence.join(" ") + ".");
  })
  return paragraph;
}

var paragraph_arr = splitGraph(new_arr, old_arr);

document.getElementById("graf").innerHTML = paragraph_arr.join(" ");
