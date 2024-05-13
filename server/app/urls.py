from django.urls import path
from . import apps

# api/{app.urls}
urlpatterns = [
    path('add_park', apps.add_park),
    path('get_park_list', apps.get_park_list),
    path('upload_image', apps.upload_image),
    path('upload', apps.upload),
    path('get_image', apps.get_image),
    path('get_park_detail', apps.get_park_detail),
    path('get_comments', apps.get_comments),
    path('add_comment', apps.add_comment),
    path('search_park_opening_hours', apps.search_park_opening_hours),
    path('search_park_entrance_fee', apps.search_park_entrance_fee),
    path('search_park_directions', apps.search_park_directions),
    path('search_park_activities', apps.search_park_activities),
    path('search_park_news', apps.search_park_news),
    path('search_park_thingstodo', apps.search_park_thingstodo),
    path('search_visitcenter', apps.search_visitcenter),


]
