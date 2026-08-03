### Heroku
- Verify `Procfile` inside the `examples` folder.
- Verify `examples/runtime.txt` (`python-3.11`), `examples/requirements.txt`, and `examples/bin/post_compile`.
- `heroku login`
- If not added, add git remote: `git remote add heroku https://git.heroku.com/nl4dv.git`
- Set buildpack for this project: `heroku buildpacks:set heroku/python` (it might err that the buildpack is already set on your app. Good, nothing to worry then.)
- Add, commit code via git.
- Push only the `examples` folder as a subtree (run it from the top level of the working tree): `git subtree push --prefix examples heroku main`
- Hope!
- Try `https://nl4dv-14924aab225c.herokuapp.com/` in browser.
- Check logs via `heroku logs --tail`

To kill a build
- `heroku plugins:install heroku-builds`
- `heroku builds:cancel -a nl4dv`

To restart the app
- `heroku restart --app nl4dv`

### Local check before deploy
```bash
cd examples
python -m spacy download en_core_web_sm
python -c "import spacy; spacy.load('en_core_web_sm'); print('spaCy OK')"
NLTK_DISABLE_IMPORT_SECURITY=1 python app.py
```
(`NLTK_DISABLE_IMPORT_SECURITY=1` may be needed if the venv lives inside `examples/`.)
Then try `/`, `/nl4dv_stylist`, `/nl4dv_llm`, `/datatone`, etc.