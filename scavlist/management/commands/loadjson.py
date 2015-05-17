import json

from django.core.management.base import BaseCommand

from scavlist.models import Item


class Command(BaseCommand):
    help = "Load a buncha data from a json."

    def add_arguments(self, parser):
        parser.add_argument("infile", type=str)

    def handle(self, *args, **options):
        infile = options["infile"]
        with open(infile, "r") as f:
            scavlist = json.loads(f.read())
        for item_desc in scavlist:
            item, created = Item.objects.get_or_create(
                number=item_desc["number"],
                defaults=item_desc)
            if created:
                print("Created item #{} in db".format(item_desc["number"]))
            else:
                print("Item#{} in db exists".format(item_desc["number"]))
