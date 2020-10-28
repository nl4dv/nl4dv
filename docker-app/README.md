dockerized usage as a RESTful API
=================================

This small example demonstrates how to convert NL4DV into a rest service served from a docker container. It just wraps the sample.py into a fastapi container.

## build and start docker container (production mode)

```bash
docker build -t mynl4dvapp .
docker run --rm -it mynl4dvapp
docker run -it --rm -p 8000:80 --name mynl4dvapp nl4dv # the docker container runs in foreground mode and can be stopped by ctrl-c
```

The docker container now runs on `localhost:8000`

## start in dev mode

alternatively, start it manually

```bash
# run nl4dv setup as described in the documentation (or peek into the [Dockerfile](./Dockerfile))
cd app
pip install -r requirements.txt
uvicorn main:app --reload
```

The fastapi now runs on `localhost:8000` and restarts as soon as python files changed.

## access the documentation and API

Start a browser and open `http://localhost:8000/docs` to open the documentation.

To issue a REST-Call, try this:

```bash
curl -X GET "http://localhost:8000/?q=create%20a%20scatterplot%20showing%20average%20gross%20across%20genres" -H  "accept: application/json"
```

Have fun.