dockerized usage as a RESTful API
=================================

This small app can be used as a starting point for implementing your own NL4DV rest service. It just wraps the sample.py into a fastapi container.

```bash
docker build -t mynl4dvapp .
docker run --rm -it mynl4dvapp
docker run -it --rm -p 80:80 --name mynl4dvapp nl4dv # the docker container runs in foreground mode and can be stopped by ctrl-c
```

Now start a browser and open `http://localhost/docs` to open the documentation.


To issue a REST-Call, try this:

```bash
curl -X GET "http://localhost/?q=create%20a%20barchart%20showing%20average%20gross%20across%20genres" -H  "accept: application/json"
```

Have fun :)