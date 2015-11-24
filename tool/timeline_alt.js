(function() {
  document.addEventListener("readystatechange", function(event) {
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

  Array.prototype.num_contains = function(x) {
    var instances = 0;
    for (var i in this) {
       if (this[i] === x) {
          instances++;
       }
    }
   return instances;
  };

  function processGrafs() {
    function convertToArr(graf) {
      var graf_arr = graf.split(/\./);
      graf_arr.pop();
      return graf_arr;
    }

    var new_graf = document.getElementById("first_graf").value; // .value || .textContent
    var old_graf = document.getElementById("second_graf").value;

    var new_graf_arr = convertToArr(new_graf);
    var old_graf_arr = convertToArr(old_graf);

    if (new_graf_arr.length === old_graf_arr.length) {
      var processed_graf = compareEqual(new_graf_arr, old_graf_arr);
    } else {
      var processed_graf = compareUnequal(new_graf_arr, old_graf_arr);
    }

    document.getElementById("graf").innerHTML = processed_graf.join("");
    document.getElementById("old_graf").innerHTML = "<h2>Original Paragraph</h2>" + old_graf;
    document.getElementById("new_graf").innerHTML = "<h2>Updated Paragraph</h2>" + new_graf;
  }

  function compareEqual(new_graf_arr, old_graf_arr) {
    var final_graf_arr = [];

    new_graf_arr.forEach(function(new_sentence) {
      var old_sentence = old_graf_arr[new_graf_arr.indexOf(new_sentence)];
      var new_new_sentence = new_sentence.toString();

      var old_sentence_arr = old_sentence.split(/\s/);
      var new_sentence_arr = new_new_sentence.split(/\s/);

      var final_sentence_arr = [];

      new_sentence_arr.forEach(function(new_sentence_word) {
        if (old_sentence_arr.contains(new_sentence_word)) {
          final_sentence_arr.push(new_sentence_word);
          old_sentence_arr.splice(old_sentence_arr.indexOf(new_sentence_word), 1);
        } else {
          final_sentence_arr.push("<strong>" + new_sentence_word + "</strong>");
        }
      });

      // TO SHOW DELETED WORDS

      var edited_sentence_arr = final_sentence_arr;
      var cut_sentence_arr = [];

      old_sentence.split(/\s/).forEach(function(old_sentence_word) {
        if (!edited_sentence_arr.contains(old_sentence_word)) {
          cut_sentence_arr.push("<s>" + old_sentence_word + "</s>");
          edited_sentence_arr.splice(old_sentence.split(/\s/).indexOf(old_sentence_word),0,"<s>" + old_sentence_word + "</s>")
        }
      });


      final_graf_arr.push(edited_sentence_arr.join(" ") + ".");
    });
    return final_graf_arr;
  }

  function compareUnequal(new_graf_arr, old_graf_arr) {
    var all_sentences_info = [];

    new_graf_arr.forEach(function(new_sentence) {
      var new_sentence_arr = new_sentence.split(/\s/);

      var sentence_info = {
        arr_pos: 0,
        num_matches: 0,
        match_percent: 0
      };

      old_graf_arr.forEach(function(old_sentence) {
        var old_sentence_arr = old_sentence.split(/\s/);

        var check_num_matches = new_sentence_arr.filter(function(new_sentence_word) {
          return old_sentence_arr.contains(new_sentence_word);
        });

        function getMatchPercent(part, whole) {
          return (part * 100) / whole;
        }

        var new_match_percent = getMatchPercent(check_num_matches.length, old_sentence_arr.length);
        var prev_match_percent = getMatchPercent(sentence_info.num_matches, old_sentence_arr.length);

        if (new_match_percent > prev_match_percent) {
          sentence_info.arr_pos = new_graf_arr.indexOf(new_sentence);
          sentence_info.num_matches = check_num_matches.length;
          sentence_info.match_percent = new_match_percent;
        }
      });

      all_sentences_info.push(sentence_info);
    });

    // SORT SENTENCES BASED ON MATCH PERCENT
    all_sentences_info.sort(function(a,b) {
      if (a.match_percent > b.match_percent) {
        return 1;
      } else if (a.match_percent < b.match_percent){
        return -1;
      } else {
        return 0;
      }
    });

    //PULL # OF LEAST-MATCHING SENTENCES EQUAL TO NUMBER OF UNMATCHED SENTENCES
    var num_unmatched_sentences = new_graf_arr.length - old_graf_arr.length;
    var unmatched_sentences = all_sentences_info.slice(0, num_unmatched_sentences);
    unmatched_sentences.sort(function(a,b) {
      if (a.arr_pos > b.arr_pos) {
        return 1;
      } else if (a.arr_pos < b.arr_pos){
        return -1;
      } else {
        return 0;
      }
    });

    var new_equal_graf_arr = (function() {
      var sliced_graf = [];
      var reference_graf = new_graf_arr;
      var i = 0;

      unmatched_sentences.forEach(function(sentence) {
        var saved_graf = new_graf_arr.slice(i, sentence.arr_pos);
        i = sentence.arr_pos + 1;
        var remaining_graf = reference_graf.slice(i);
        reference_graf = remaining_graf;
        sliced_graf.push(saved_graf);
      });

      var shortened_graf = sliced_graf.concat(reference_graf);
      return shortened_graf;
    })();

    var final_graf_arr = compareEqual(new_equal_graf_arr, old_graf_arr);

    unmatched_sentences.forEach(function(sentence) {
      var processed_unmatched = "<strong>" + new_graf_arr[sentence.arr_pos] + "." + "</strong>";
      final_graf_arr.splice(sentence.arr_pos, 0, processed_unmatched);
    });

    return final_graf_arr;
  }
}());
