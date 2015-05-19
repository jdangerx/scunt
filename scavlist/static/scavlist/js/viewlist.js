"use strict";

// (function(){
function RowView(item) {
  this.item = item;
  this.tag = $("<tr>");
  this.tag.click(this.showDetails.bind(this));
}

RowView.prototype.showDetails = function() {
  $("#item-details").html(this.item.text);
  $("#item-details").fadeIn();
};

RowView.prototype.render = function() {
  this.tag.append($("<td class='item-number'>" + this.item.number + "</td>"));
  this.tag.append($("<td class='item-text'>" + this.item.text + "</td>"));
  this.tag.append($("<td class='item-point-txt'>" + this.item.point_txt + "</td>"));
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
  console.log("filtering by " + field + ", " + value);
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
  return listView;
}

// window.initList = initList;

$(document).ready(function() {
  var listView = initList();
  listView.loadFullList();
});
// })();
