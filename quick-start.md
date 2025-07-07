# html2pdf Quick Start Guide

## Global Installation Complete ✅

The html2pdf tool is now globally available in your system. Test it with:

```bash
html2pdf --version
```

## Common Use Cases

### 1. Simple HTML to PDF
```bash
html2pdf document.html
# Creates document.pdf in the same directory
```

### 2. Presentation with Slides (A4 Landscape)
```bash
html2pdf presentation.html -f A4 -l -o slides.pdf
```

### 3. Full-bleed (No Margins)
```bash
html2pdf content.html --margin-top 0 --margin-bottom 0 --margin-left 0 --margin-right 0
```

### 4. Multi-page Document
```bash
html2pdf multi-page.html --prefer-css-page-size --header --footer
```

### 5. Custom Size (Poster)
```bash
html2pdf poster.html -w 24in -h 36in
```

## Added to Claude.md

The tool has been added to your global Claude.md file, so Claude Code will automatically know to use this tool for HTML to PDF conversions.

## Repository

GitHub: https://github.com/ssql2014/html2pdf

The tool is now ready for use in any project!