#!/bin/sh
uwsgi --ini /home/server/wsgi.ini --daemonize /home/server.log
/bin/bash