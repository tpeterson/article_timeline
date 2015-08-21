// THIS SCRIPT IDENTIFIES WHICH SENTENCE DOESN'T APPEAR IN BOTH PARAGRAPHS

var new_new = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people, including people who may have missed the original post. There's no algorithm to resurface old-yet-popular posts. Instagram is not Facebook; it's Twitter without the retweet ripple effect.";

var old_old = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people. There's no algorithm to resurface old-yet-popular posts.";

function grafArr(graf) {
  var graf_arr = graf.split(/\./);
  graf_arr.pop();
  return graf_arr;
}

var new_arr = grafArr(new_new);
var old_arr = grafArr(old_old);

Array.prototype.contains = function(x) {
  for (var i in this) {
    if (this[i] == x) {
      return true;
    }
  }
  return false;
}

function getAverage(part, whole) {
  return (part * 100) / whole;
}

function checkContain(new_sentence, old_paragraph) {
  var matched = {
    arr_pos: 0,
    num_matches: 0,
    percent_matches: 0,
    old_length: 0
  };

  for (var i = 0; i < old_paragraph.length; i++) {
    var old_sentence = old_paragraph[i].split(/\s/);

    var filtered = new_sentence.split(/\s/).filter(function(word) {
      return old_sentence.contains(word);
    });

    var filtered_percent = getAverage(filtered.length, old_sentence.length);
    var old_matched_percent = getAverage(matched.num_matches, old_sentence.length);

    if (filtered_percent > old_matched_percent) {
      matched.arr_pos = new_arr.indexOf(new_sentence);
      matched.num_matches = filtered.length;
      matched.percent_matches = filtered_percent;
      matched.old_length = old_sentence.length;
    }
  }

  return matched;
}

function findOddSent(new_graf, old_graf) {
  var unmatched_sent_pos = [];

  new_graf.forEach(function(new_arr_sent) {
    var match_info = checkContain(new_arr_sent, old_graf);

    if (match_info.percent_matches < 20) {
      unmatched_sent_pos.push(match_info.arr_pos);
    }
  })

  return unmatched_sent_pos;
}

if (new_arr.length !== old_arr.length) {
  var odd_sent = findOddSent(new_arr, old_arr);
  document.getElementById("graf").innerHTML = "<strong>Unmatched sentence:</strong> " + new_arr[odd_sent[0]] + ".";
}
