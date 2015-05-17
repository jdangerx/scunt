import itertools
import json

from django.test import TestCase

from scavlist.models import Item

# class PageOwnershipTest(TestCase):
#     def setUp(self):
#         pass

#     def test_no_page_captains(self):
#         pass

#     def test_one_page_captain_per_page(self):
#         pass

#     def test_multiple_page_captains_per_page(self):
#         pass


class ViewListTest(TestCase):
    fixtures = ["2015_fixture.json"]

    def test_get_the_list_json(self):
        response = self.client.get('/list/json')
        self.assertEqual(response.status_code, 200)
        items = json.loads(response.content.decode())
        self.assertEqual(len(items), 323)
        fieldnames = {f.name for f in itertools.chain(
            Item._meta.fields, Item._meta.many_to_many)}
        for item in items:
            self.assertEqual(set(item.keys()), fieldnames)
