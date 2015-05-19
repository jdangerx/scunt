describe("List view", function() {

  beforeEach(function () {
    var firstTenItems = '[{"point_txt":"1 point","earlysub":false,"max_val":1,"complete":false,"id":1,"page":1,"min_val":1,"text":"A copy of the 2015  University of Chicago Scavenger Hunt List.","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":1,"tags":[],"updated":""},{"point_txt":"2 points","earlysub":false,"max_val":2,"complete":false,"id":2,"page":1,"min_val":2,"text":"A copy of the 2014 University of Chicago Alumni Weekend Scavenger Hunt List.","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":2,"tags":[],"updated":""},{"point_txt":"5 points; 2 extra points for the ``winner\'\'","earlysub":false,"max_val":-1,"complete":false,"id":3,"page":1,"min_val":-1,"text":"Is your refrigerator running, emph{literally}? THEN YOU\'D BETTER CANVAS FOR IT! SHOW YOUR SUPPORT, AND HELP IT GET ELECTED!","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":3,"tags":[],"updated":""},{"point_txt":"60 points for making it; 80 points for finding it","earlysub":false,"max_val":-1,"complete":false,"id":4,"page":1,"min_val":-1,"text":"The worst part about having Judgment on a Sunday is that we have to miss the ball-game. Keep the whole room at Judgment up to date on the score of the Sox or Cubs using your own Compton Electric Base Ball Game Impersonator, Nokes Electrascore, Play-o-Graph, Jackson Manikin Baseball Indicator, or similar product of your own construction.","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":4,"tags":[],"updated":""},{"point_txt":"3 Jeets Jeets Jeets points","earlysub":false,"max_val":-1,"complete":false,"id":5,"page":1,"min_val":-1,"text":"A Derek Jeter Sex Parting Gift Basket, sans gifts. Must be verified in the same way as the Craigslist posting.","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":5,"tags":[],"updated":""},{"point_txt":"12 points for gray; 15 points for color","earlysub":false,"max_val":-1,"complete":false,"id":6,"page":1,"min_val":-1,"text":"Printed selfies of your Captains taken on a Game Boy camera.","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":6,"tags":[],"updated":""},{"point_txt":"7 points","earlysub":true,"max_val":7,"complete":false,"id":7,"page":1,"min_val":7,"text":"Go on Xbox Livetr and demonstrate the cold hard logic of your modus pwnens. Points for clarity and educational value of your lecture on formal logic, as well as your ability to speak in a language the n00bs will understand. You\'d better maintain a K/D ratio above .75 or there is no way they\'ll take you seriously.","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":7,"tags":[],"updated":""},{"point_txt":"2 points","earlysub":false,"max_val":2,"complete":false,"id":8,"page":1,"min_val":2,"text":"Spying a billboard on the road out of Loda, the Bauxite Troll realizes it can be something more. It can be a parent.","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":8,"tags":[],"updated":""},{"point_txt":"and sing the lyrics). Grey Face 8 space points","earlysub":false,"max_val":-1,"complete":false,"id":9,"page":1,"min_val":-1,"text":"This year\'s Scav Olympics will be broadcast on Twitch! Well, not really, but you should still send four team members ready to simulate the chat experience from the peanut gallery. They should hold up emoticon signs while speaking the text, recite verbal copypasta, and be able to give any !songname","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":9,"tags":[],"updated":""},{"point_txt":"9 for no hitter; 21 points above replacement for a perfect game","earlysub":false,"max_val":-1,"complete":false,"id":10,"page":1,"min_val":-1,"text":"A scorecard from a Major League Baseball no-hitter, officially licensed by the home team.","roadtrip":false,"contacts":[],"location":"","due":"2015-05-10 17:51:00+00:00","number":10,"tags":[],"updated":""}]';
    jasmine.Ajax.stubRequest("/list/json").andReturn({
      responseText: firstTenItems,
    });
  });

  it("loads the data", function() {
    var listView = initList();
    listView.loadFullList();

    expect(listView.list.length).toBe(10);
  });

  it("makes the rows", function() {
    var listView = initList();
    listView.loadFullList();
    listView.render();

    expect(listView.rows.length).toBe(10);
  });

  it("filters by text properly", function() {
    var listView = initList();
    listView.loadFullList();
    listView.render();

    listView.filterBy("text", "A copy of the 201");
    var visibleRows = listView.rows.filter(function(rowView){
      return !rowView.tag[0].hidden;
    });
    expect(visibleRows.length).toBe(2);

  });

});
