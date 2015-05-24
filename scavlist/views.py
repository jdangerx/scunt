import json

from django.forms import model_to_dict
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from scavlist.models import Item, ContactInfo
from scavlist.forms import ClaimItemForm


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
    # if request.user is something not anon we can pre-fill ClaimItemForm
    return render(request, "viewlist.html", {"claim_form": ClaimItemForm()})


def run_jasmine(request, js_name):
    return render(request, "jasmine-runner.html", {"js_name": js_name})


def claim_item(request, itemnum):
    try:
        itemnum = int(itemnum)
    except ValueError:
        return HttpResponse(status=400)

    try:
        item = Item.objects.get(number=itemnum)
    except Item.DoesNotExist:
        return HttpResponse(status=400)

    if request.method == "POST":
        try:
            existing_contact = ContactInfo.objects.get(
                name__iexact=request.POST["name"],
                email__iexact=request.POST["email"],
            )
        except ContactInfo.DoesNotExist:
            claim = ClaimItemForm(request.POST)
        else:
            claim = ClaimItemForm(request.POST, instance=existing_contact)
        if claim.is_valid():
            contact = claim.save()
            item.contacts.add(contact)
            item.save()
            return JsonResponse(
                {"msg": "Successfully claimed item {}".format(item.number)})

        else:
            return HttpResponse(status=400)
