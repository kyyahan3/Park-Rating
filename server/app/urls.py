from django.urls import path
from . import apps

# api/{app.urls}
urlpatterns = [
    path('/add_park', apps.add_park),
    path('/get_park_list', apps.get_park_list),
    path('/upload_image', apps.upload_image),
    path('/get_image', apps.get_image),
    path('/get_park_detail', apps.get_park_detail),
    path('/get_comments', apps.get_comments),

]
