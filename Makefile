DEVBUILD="http://localhost/sporkexec/"
LIVEBUILD="http://sporkexec.com/"

all: site
site:
	lessc -x style/desktop.less > style/desktop.css
	lessc -x style/mobile.less > style/mobile.css

	# I'm sure this isn't ideal, but fine for now.
	# This saves me from manually switching baseurl.
	sed -i "s!${LIVEBUILD}!${DEVBUILD}!g" _config.yml
	jekyll
	sed -i "s!${DEVBUILD}!${LIVEBUILD}!g" _config.yml

