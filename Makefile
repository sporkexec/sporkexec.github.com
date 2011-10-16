all: site

site:
	lessc -x style/desktop.less > style/desktop.css
	jekyll

