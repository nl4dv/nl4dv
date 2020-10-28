FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

RUN pip install nl4dv spacey nltk 
RUN python -m spacy download en_core_web_sm
RUN python -m nltk.downloader popular

COPY ./resources /resources
COPY ./app /app
RUN pip install -r /app/requirements.txt
