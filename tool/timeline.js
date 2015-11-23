(function(){
  document.addEventListener("readystatechange", function(event){
    document.getElementById("compare_button").addEventListener("click", processGrafs, false);
  });

  Array.prototype.contains = function(x) {
    for (var i in this) {
      if (this[i] == x) {
        return true;
      }
    }
    return false;
  };

  function processGrafs() {
    function convertToArr(graf) {
      var graf_arr = graf.split(/\./);
      graf_arr.pop();
      return graf_arr;
    }

    var new_new = document.getElementById('first_graf').value;
    var old_old = document.getElementById('second_graf').value;

    var new_graf_arr = convertToArr(new_new);
    var old_graf_arr = convertToArr(old_old);

    if (new_graf_arr.length === old_graf_arr.length) {
      var checked_graf = compareEqual(new_graf_arr, old_graf_arr);
      document.getElementById("graf").innerHTML = checked_graf.join("");
      document.getElementById("old_graf").innerHTML = "<h2>Original Paragraph</h2>" + old_old;
      document.getElementById("new_graf").innerHTML = "<h2>Updated Paragraph</h2>" +
      new_new;
    } else {
      var checked_graf = compareUnequal(new_graf_arr, old_graf_arr);
      document.getElementById("graf").innerHTML = checked_graf.join("");
      document.getElementById("old_graf").innerHTML = "<h2>Original Paragraph</h2>" + old_old;
      document.getElementById("new_graf").innerHTML = "<h2>Updated Paragraph</h2>" +
      new_new;
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

    console.log(new_graf_arr);
    console.log(old_graf_arr);

    new_graf_arr.forEach(function(new_sentence) {
      var new_sentence_arr = new_sentence.split(/\s/);

      console.log("New sentence array: " + new_sentence_arr);

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

          console.log("Old sentence array: " + old_sentence_arr);

          var how_many_matches = new_sentence_arr.filter(function(new_sentence_word) {
            console.log(new_sentence_word + " ... " + old_sentence_arr.contains(new_sentence_word));
            return old_sentence_arr.contains(new_sentence_word);
          });

          function getMatchPercentage(part, whole) {
            console.log((part * 100) / whole);
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

      console.log("Match rate: " + match_rate.percent_matched);

      if (match_rate.percent_matched < 30) {
        console.log("Unmatched Sentence array position: " + match_rate.match_arr_position);
        unmatched_sentence_arr_position.push(match_rate.match_arr_position);
      }
    });

    var new_equal_graf_arr = (function() {
      console.log("New Graf Array: " + new_graf_arr);
      var first_half_graf = new_graf_arr.slice(0, unmatched_sentence_arr_position[0]);
      var second_half_graf = new_graf_arr.slice(unmatched_sentence_arr_position[0] + 1);
      var equated_graf = first_half_graf.concat(second_half_graf);
      return equated_graf;
    })();

    var checked_equal_graf = compareEqual(new_equal_graf_arr, old_graf_arr);

    var unmatched_sentence = "<strong>" + new_graf_arr[unmatched_sentence_arr_position] + "." + "</strong>";
    checked_equal_graf.splice(unmatched_sentence_arr_position, 0, unmatched_sentence);
    return checked_equal_graf;
  }
}());
