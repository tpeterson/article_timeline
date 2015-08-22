var new_new = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people, including people who may have missed the original post. There's no algorithm to resurface old-yet-popular posts. Instagram is not Facebook; it's Twitter without the retweet ripple effect.";

var old_old = "Brands on Instagram can't bank on people liking, sharing or commenting on their posts as a way to get those posts in front of more people. There's no algorithm to resurface old-yet-popular posts.";

Array.prototype.contains = function(x) {
  for (var i in this) {
    if (this[i] == x) {
      return true;
    }
  }
  return false;
}

function processGrafs(new_graf, old_graf) {
  function convertToArr(graf) {
    var graf_arr = graf.split(/\./);
    graf_arr.pop();
    return graf_arr;
  }

  var new_graf_arr = convertToArr(new_graf);
  var old_graf_arr = convertToArr(old_graf);

  if (new_graf_arr.length === old_graf_arr.length) {
    var checked_graf = compareEqual(new_graf_arr, old_graf_arr);
    console.log(checked_graf.join(""));
  } else {
    var checked_graf = compareUnequal(new_graf_arr, old_graf_arr);
    console.log(checked_graf.join("") + ".");
  }
}

function compareEqual(new_graf_arr, old_graf_arr) {
  var final_paragraph_arr = [];

  new_graf_arr.forEach(function(new_sentence) {
    var old_sentence = old_graf_arr[new_graf_arr.indexOf(new_sentence)];

    var old_sentence_arr = old_sentence.split(/\s/);
    var new_sentence_arr = new_sentence.split(/\s/);

    var final_sentence_arr = [];

    new_sentence_arr.forEach(function(new_sentence_word) {
      if (new_sentence_word === old_sentence_arr[0]) {
        final_sentence_arr.push(new_sentence_word);
        old_sentence_arr.splice(0, 1);
      } else {
        var unmatched_word = "<strong>" + new_sentence_word + "</strong>";
        final_sentence_arr.push(unmatched_word);
      }
    });

    final_paragraph_arr.push(final_sentence_arr.join(" ") + ".");
  });
  return final_paragraph_arr;
}

function compareUnequal(new_graf_arr, old_graf_arr) {
  var unmatched_sentence_arr_position = [];

  new_graf_arr.forEach(function(new_sentence) {
    var new_sentence_arr = new_sentence.split(/\s/);

    var match_rate = (function sendNewSentence() {
      var sentence_match_info = {
        match_arr_position: 0,
        num_matches: 0,
        percent_matched: 0,
        old_graf_length: 0
      };

      // FIND CLOSEST MATCH IN OLD GRAF (THE HIGHEST MATCH % SHOULD STILL BE LOW FOR A NON-MATCHED SENTENCE)
      old_graf_arr.forEach(function compareSentences(old_sentence) {
        var old_sentence_arr = old_sentence.split(/\s/);

        var how_many_matches = new_sentence_arr.filter(function(new_sentence_word) {
          return old_sentence_arr.contains(new_sentence_word);
          //console.log(new_sentence_word);
        });

        function getMatchPercentage(part, whole) {
          return (part * 100) / whole;
        }

        var new_match_percentage = getMatchPercentage(how_many_matches.length, old_sentence_arr.length);
        var prev_match_percentage = getMatchPercentage(sentence_match_info.num_matches, old_sentence_arr.length);

        if (new_match_percentage > prev_match_percentage) {
          sentence_match_info.match_arr_position = new_graf_arr.indexOf(new_sentence);
          sentence_match_info.num_matches = how_many_matches.length;
          sentence_match_info.percent_matched = new_match_percentage;
          sentence_match_info.old_graf_length = old_sentence_arr.length;
        }
      });
      return sentence_match_info;
    })();

    if (match_rate.percent_matched < 20) {
      unmatched_sentence_arr_position.push(match_rate.match_arr_position);
    }
  });

  var new_equal_graf_arr = (function() {
    var first_half_graf = new_graf_arr.slice(0, unmatched_sentence_arr_position);
    var second_half_graf = new_graf_arr.slice(unmatched_sentence_arr_position + 1);
    var equated_graf = first_half_graf.concat(second_half_graf);

    return equated_graf;
  })();

  var checked_equal_graf = compareEqual(new_equal_graf_arr, old_graf_arr);

  var unmatched_sentence = "<strong>" + new_graf_arr[unmatched_sentence_arr_position] + "</strong>";
  checked_equal_graf.splice(unmatched_sentence_arr_position, 0, unmatched_sentence);
  return checked_equal_graf;
}

processGrafs(new_new, old_old);
