var new_new = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people, including people who may have missed the original post. There's no algorithm to resurface old-yet-popular posts. Instagram is not Facebook; it's Twitter without the retweet ripple effect.";

var old_old = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people. There's no algorithm to resurface old-yet-popular posts.";

function grafArr(graf) {
  var graf_arr = graf.split(/\./); // push sentences into an array
  graf_arr.pop(); // delete element after final '.
  return graf_arr;
}

var new_arr = grafArr(new_new);
var old_arr = grafArr(old_old);

function checkIfEqual(new_graf, old_graf) {
  if (new_arr.length === old_arr.length) {
    compareEqual(new_arr, old_arr);
  } else {
    compareUnequal(new_arr, old_arr);
  }
}

function compareEqual(new_arr, old_arr) {
  var paragraph_arr = splitGraph(new_arr, old_arr);
  document.getElementById("graf").innerHTML = paragraph_arr.join(" ");
}

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
  });

  return paragraph;
}

function compareUnequal(new_arr, old_arr) {
  var odd_sent = findOddSent(new_arr, old_arr);

  // cut superfluous sentence from new graf
  var cut_graf = removeOddSent(new_arr, odd_sent);
  // find unmatched words in grafs with same number of sentences
  var edited_graf = splitGraph(cut_graf, old_arr);

  // add superfluous sentence back into graf
  var new_sent = "<strong>" + new_arr[odd_sent] + "</strong>";
  edited_graf.splice(odd_sent, 0, new_sent);

  document.getElementById("graf").innerHTML = "<strong>Unmatched sentence:</strong> " + new_arr[odd_sent[0]] + ".";
  document.getElementById("cut_graf").innerHTML = edited_graf.join("") + ".";
}

function findOddSent(new_graf, old_graf) {
  var unmatched_sent_pos = [];

  new_graf.forEach(function(new_arr_sent) {
    var match_info = checkContain(new_arr_sent, old_graf);

    if (match_info.percent_matches < 20) {
      unmatched_sent_pos.push(match_info.arr_pos);
    }
  });

  return unmatched_sent_pos;
}

function checkContain(new_sentence, old_paragraph) {
  var matched = {
    arr_pos: 0,
    num_matches: 0,
    percent_matches: 0,
    old_length: 0
  };

  Array.prototype.contains = function(x) {
    for (var i in this) {
      if (this[i] == x) {
        return true;
      }
    }
    return false;
  };

  function getAverage(part, whole) {
      return (part * 100) / whole;
  }

  for (var i = 0; i < old_paragraph.length; i++) {
    var old_sentence = old_paragraph[i].split(/\s/);

    var filtered = new_sentence.split(/\s/).filter(function(word) {
      return old_sentence.contains(word);
    });

    var filtered_percent = getAverage(filtered.length, old_sentence.length);
    var old_matched_percent = getAverage(matched.num_matches, old_sentence.length);

    if (filtered_percent > old_matched_percent) {
      matched.arr_pos = new_arr.indexOf(new_sentence); //BREAKS HERE
      matched.num_matches = filtered.length;
      matched.percent_matches = filtered_percent;
      matched.old_length = old_sentence.length;
    }
  }

  return matched;
}

function removeOddSent(new_graf, odd_pos) {
  var half_graf = new_graf.slice(0, odd_pos);
  var other_half = new_graf.slice(odd_pos + 1);

  var cut_graf = half_graf.concat(other_half);
  return cut_graf;
}

checkIfEqual(new_arr, old_arr);
