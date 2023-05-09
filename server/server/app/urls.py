from django.urls import path
from . import apps

# api/{app.urls}
urlpatterns = [
    path('/list', apps.list, name = "list"),
]