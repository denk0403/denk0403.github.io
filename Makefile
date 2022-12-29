start: _config.yml
	jekyll serve --drafts

start_prod: _config.yml
	jekyll serve

build: _config.yml
	jekyll build --trace

draft: _config.yml
	jekyll build --trace --drafts

