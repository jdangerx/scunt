"use strict";

(function(){

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
      this.tag.append($("<td>" + this.item.number + "</td>"));
      this.tag.append($("<td>" + this.item.text + "</td>"));
      this.tag.append($("<td>" + this.item.point_txt + "</td>"));
  };

  function ListView() {
    this.list = [];
    this.tag = $("<table>");
    this.rows = [];
  }

  ListView.prototype.filterBy = function(field, value) {
    this.rows.forEach(function(rowView) {
      var fieldContainsValue = false;
      if (field === "text") {
        var itemField = rowView.item[field].toLowerCase();
        fieldContainsValue = itemField.indexOf(value.toLowerCase()) !== -1;
      }
      if (fieldContainsValue) {
        rowView.tag.show();
      } else {
        // console.log("making sure " + rowView.item.number + "is hidden");
        rowView.tag.hide();
      }
      // rowView.tag.hidden = !fieldContainsValue;
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

  $(document).ready(function() {
    var listView = new ListView()
    $("#the-list").append(listView.tag);
    listView.render();

    $("#item-details").click(function(){$("#item-details").fadeOut();});
    $("#text-search").keyup(function() {
      listView.filterBy("text", $("#text-search").val());
    });

    $.ajax("/list/json",
           {dataType: "json",
            success: function(data) {
              console.log("Success!", data[1]);
              listView.list = data;
              listView.render();
            },
            error: function(xhr, textStatus, errorThrown) {
              console.log("Error:", xhr, textStatus, errorThrown);
            },
           }
          );
  });
})();
