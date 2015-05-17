from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^json$', views.list_json, name='list_json'),
    url(r'^$', views.view_list, name='view_list'),
]
