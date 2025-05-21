#!/bin/sh
exec gunicorn -k uvicorn.workers.UvicornWorker backend.main:app --bind 0.0.0.0:${PORT}
