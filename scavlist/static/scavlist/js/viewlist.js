"use strict";

(function djangAjaxScience() {
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
            }
          }
        }
        return cookieValue;
      }
      xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
  });
})();

// (function(){
function RowView(item) {
  this.item = item;
  this.tag = $("<tr>");
  this.tag.click(this.showDetails.bind(this));
  this.signUpBtn = $("<td class='claim-btn'>Sign up!</td>");

  this.signUpBtn.click(function(evt) {
    evt.stopPropagation();
    console.log("signing up for item #" + this.item.number);
    $.ajax({
      url: "/list/claim/"+this.item.number,
      method: "POST",
      data: $("#claim-form").serialize(),
      dataType: "json",
      success: function(data) {
        console.log("Success!", data);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log("Error!", xhr, textStatus, errorThrown);
      }
    });
  }.bind(this));
}

RowView.prototype.showDetails = function() {
  $("#item-details").html(this.item.text);
  $("#item-details").fadeIn();
};

RowView.prototype.render = function() {
  this.tag.append($("<td class='item-number'>" + this.item.number + "</td>"));
  this.tag.append($("<td class='item-text'>" + this.item.text + "</td>"));
  this.tag.append($("<td class='item-point-txt'>" + this.item.point_txt + "</td>"));
  this.tag.append(this.signUpBtn);
};

function ListView() {
  this.list = [];
  this.tag = $("<table>");
  this.rows = [];
}

ListView.prototype.loadFullList = function() {
  $.ajax("/list/json",
         {dataType: "json",
          success: function(data) {
            this.list = data;
            this.render();
          }.bind(this),
          error: function(xhr, textStatus, errorThrown) {
            console.log("Error:", xhr, textStatus, errorThrown);
          },
         }
        );
};

ListView.prototype.filterBy = function(field, value) {
  this.rows.forEach(function(rowView) {
    var fieldContainsValue = false;
    var itemField = "";
    if (field === "text") {
      if (value.toLowerCase() === value) { // value is lowercase
        itemField = rowView.item[field].toLowerCase();
      } else {
        itemField = rowView.item[field];
      }
      fieldContainsValue = itemField.indexOf(value) !== -1;
    } else if (field == "points") {
      var min_val = rowView.item.min_val;
      var max_val = rowView.item.min_val;
      fieldContainsValue = min_val >= value[0] && max_val <= value[1];
    }
    rowView.tag[0].hidden = !fieldContainsValue;
  });
};

ListView.prototype.render = function() {
  if (this.list.length !== this.rows.length) {
    this.tag.empty();
    this.rows = this.list.map(function(item) {
      return new RowView(item);
    });
    this.rows.forEach(function(rowView) {
      this.tag.append(rowView.tag);
    }.bind(this));
  }
  this.rows.forEach(function(rowView) {
    rowView.render();
  });
};

function initList() {
  var listView = new ListView();
  $("#the-list").append(listView.tag);
  listView.render();

  $("#item-details").click(function(){$("#item-details").fadeOut();});
  $("#text-search").keyup(function() {
    listView.filterBy("text", $("#text-search").val());
  });

  $(function() {
    $("#points-search").slider({
      range: true,
      min: -1,
      max: 250,
      values: [-1, 250],
      slide: function updatePointsDisplay(evt, ui) {
        listView.filterBy("points", ui.values);
        $("#points-range-display").html(ui.values[0] + " - " + ui.values[1]);
      }
    });
  });
  return listView;
}

// window.initList = initList;

$(document).ready(function() {
  var listView = initList();
  listView.loadFullList();
});
// })();
