from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^json$', views.list_json, name='list_json'),
    url(r'^test/(?P<js_name>.*)$', views.run_jasmine, name='run_jasmine'),
    url(r'^$', views.view_list, name='view_list'),
]
