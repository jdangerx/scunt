import json

from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render

from scavlist.models import Item


def list_json(request):
    items = Item.objects.all()
    items_dicts = [model_to_dict(item) for item in items]
    for item in items_dicts:
        item["contacts"] = list(item["contacts"])
        item["tags"] = list(item["tags"])
        item["due"] = str(item["due"])
        item["updated"] = str(item.get("updated", ""))
    return JsonResponse(items_dicts, safe=False)


def view_list(request):
    return render(request, "viewlist.html")


def run_jasmine(request, js_name):
    return render(request, "jasmine-runner.html", {"js_name": js_name})
