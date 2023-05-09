from django.http import HttpResponse
import json


def response(code: int, message: str, data: any = None):
    body = {"code": code, "message": message, "data": {}}
    if data is not None:
        if hasattr(data, '__dict__'):
            body['data'] = data.__dict__
        else:
            body['data'] = data

    # convert to JSON
    return HttpResponse(json.dumps(body, sort_keys=True, ensure_ascii=False))


list_data = [
    {"title": "test1", "starts": 1, "desc": "test1 desc", "imgs": [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        "https://www.exploregeorgia.org/sites/default/files/styles/slideshow_large/public/2022-06/timberline-glamping-lake-lanier.jpg?itok=pGl5rdJe"]}
]


def list(request):
    return response(0, "ok", list_data)
