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

    var new_new = document.getElementById('first_graf').value; // .value || .textContent
    var old_old = document.getElementById('second_graf').value; // .value || .textContent

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

      var new_new_sent = new_sentence.toString();
      var old_sentence_arr = old_sentence.split(/\s/);
      var new_sentence_arr = new_new_sent.split(/\s/);

      var final_sentence_arr = [];

      new_sentence_arr.forEach(function(new_sentence_word) {

        if (new_sentence_word === old_sentence_arr[0]) {
          final_sentence_arr.push(new_sentence_word);
          old_sentence_arr.splice(0, 1);
        } else {
          var unmatched_word = "<strong>" + new_sentence_word + "</strong>";
          final_sentence_arr.push(unmatched_word);
          console.log(new_sentence_word);
        }
      });

      final_paragraph_arr.push(final_sentence_arr.join(" ") + ".");
    });
    return final_paragraph_arr;
  }

  function compareUnequal(new_graf_arr, old_graf_arr) {
    var unmatched_sentences = [];
    var num_unmatched_sentences = new_graf_arr.length - old_graf_arr.length;
    var sentences_info = [];

    new_graf_arr.forEach(function(new_sentence) {
      var new_sentence_arr = new_sentence.split(/\s/);

      var sentence_match_info = {
        match_arr_position: 0,
        num_matches: 0,
        percent_matched: 0,
        old_graf_length: 0
      };

      old_graf_arr.forEach(function compareSentences(old_sentence) {
        var old_sentence_arr = old_sentence.split(/\s/);

        var how_many_matches = new_sentence_arr.filter(function(new_sentence_word) {
          return old_sentence_arr.contains(new_sentence_word);
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

      sentences_info.push(sentence_match_info);
    });

    sentences_info.sort(function(a,b){
      if (a.percent_matched > b.percent_matched) {
        return 1;
      }
      if (a.percent_matched < b.percent_matched) {
        return -1;
      }
      return 0;
    });

    unmatched_sentences = sentences_info.slice(0, num_unmatched_sentences);

    unmatched_sentences.sort(function(a,b){
      if (a.match_arr_position > b.match_arr_position) {
        return 1;
      }
      if (a.match_arr_position < b.match_arr_position) {
        return -1;
      }
      return 0;
    });

    var new_equal_graf_arr = (function() {
      var sliced_graf = [];
      var starter_graf = new_graf_arr;
      var i = 0;

      unmatched_sentences.forEach(function(sent) {
        var first_half_graf = new_graf_arr.slice(i, sent.match_arr_position);
        i = sent.match_arr_position + 1;
        var second_half_graf = starter_graf.slice(i);
        starter_graf = second_half_graf;
        sliced_graf.push(first_half_graf);
      });

      var equated_graf = sliced_graf.concat(starter_graf);
      return equated_graf
    })();

    var checked_equal_graf = compareEqual(new_equal_graf_arr, old_graf_arr);

    unmatched_sentences.forEach(function(sent) {
      var styled_unmatched = "<strong>" + new_graf_arr[sent.match_arr_position] + "." + "</strong>";
      checked_equal_graf.splice(sent.match_arr_position, 0, styled_unmatched);
    });

    return checked_equal_graf;
  }
}());
