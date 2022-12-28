start: _config.yml
	jekyll serve --drafts

build: _config.yml
	jekyll build --trace

draft: _config.yml
	jekyll build --trace --drafts