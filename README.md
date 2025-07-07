# html2pdf

A powerful command-line tool to convert HTML files to PDF with customizable options. Built with Puppeteer for accurate rendering and full support for modern web features.

## Features

- 🎯 Accurate HTML to PDF conversion
- 📄 Support for multiple page formats (A4, A3, Letter, etc.)
- 🔄 Landscape and portrait orientations
- 🎨 Background graphics and colors preservation
- 📏 Customizable margins
- 📑 Page range selection
- 🔧 CSS injection for custom styling
- 📊 Header and footer support
- ⏱️ Configurable wait time for dynamic content
- 🌐 Full support for modern CSS and JavaScript

## Installation

### Global Installation (Recommended)

```bash
npm install -g html2pdf-cli
```

### Local Installation

```bash
git clone https://github.com/yourusername/html2pdf.git
cd html2pdf
npm install
npm link
```

## Usage

### Basic Usage

```bash
html2pdf input.html
```

This will create `input.pdf` in the same directory.

### Advanced Usage

```bash
html2pdf input.html -o output.pdf -f A4 -l -b --margin-top 20mm --margin-bottom 20mm
```

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--output` | `-o` | Output PDF file path | `{input-name}.pdf` |
| `--format` | `-f` | Page format (A4, A3, Letter, Legal, Tabloid) | `A4` |
| `--landscape` | `-l` | Use landscape orientation | `false` |
| `--margin-top` | | Top margin | `0` |
| `--margin-bottom` | | Bottom margin | `0` |
| `--margin-left` | | Left margin | `0` |
| `--margin-right` | | Right margin | `0` |
| `--background` | `-b` | Print background graphics | `true` |
| `--scale` | | Scale of the webpage rendering | `1` |
| `--width` | `-w` | Paper width (overrides format) | |
| `--height` | `-h` | Paper height (overrides format) | |
| `--wait` | | Wait time in ms before generating PDF | `1000` |
| `--css` | | Additional CSS to inject | |
| `--header` | | Display header with title and date | `false` |
| `--footer` | | Display footer with page numbers | `false` |
| `--range` | | Page ranges to print (e.g., "1-5, 8, 11-13") | |
| `--prefer-css-page-size` | | Use CSS-defined page size | `false` |
| `--help` | `-h` | Show help | |
| `--version` | `-v` | Show version | |

### Examples

#### Convert with A3 landscape format
```bash
html2pdf report.html -o report.pdf -f A3 -l
```

#### Add margins and page numbers
```bash
html2pdf document.html --margin-top 25mm --margin-bottom 25mm --footer
```

#### Custom page size
```bash
html2pdf poster.html -w 24in -h 36in -o poster.pdf
```

#### Inject custom CSS
```bash
html2pdf page.html --css "body { zoom: 0.75; }"
```

#### Wait for dynamic content
```bash
html2pdf dynamic.html --wait 5000
```

#### Print specific pages
```bash
html2pdf long-document.html --range "1-10, 15, 20-25"
```

## Use Cases

### 1. Multi-page Presentations
Perfect for converting HTML presentations with slide breaks:

```bash
html2pdf presentation.html -f A4 -l --margin-top 0 --margin-bottom 0
```

### 2. Reports with Headers/Footers
Generate professional reports with page numbers:

```bash
html2pdf report.html --header --footer --margin-top 20mm --margin-bottom 20mm
```

### 3. Posters and Large Format
Create large format PDFs:

```bash
html2pdf poster.html -w 841mm -h 1189mm  # A0 size
```

### 4. Web Page Archives
Archive web pages with all styling preserved:

```bash
html2pdf webpage.html -b --wait 3000
```

## Tips for HTML Preparation

### Page Breaks
Use CSS page break properties in your HTML:

```css
.page-break {
    page-break-after: always;
}

.keep-together {
    page-break-inside: avoid;
}
```

### Print Styles
Add print-specific styles:

```css
@media print {
    body {
        margin: 0;
        background: white;
    }
    
    .no-print {
        display: none;
    }
}
```

### Color Preservation
Ensure colors are preserved in print:

```css
* {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}
```

## Troubleshooting

### Fonts not displaying correctly
Ensure fonts are embedded or use web-safe fonts. You can also wait longer for fonts to load:
```bash
html2pdf document.html --wait 3000
```

### Background colors missing
Use the `--background` flag (enabled by default) and ensure your CSS includes print color adjustments.

### Content cut off
Try adjusting the scale or margins:
```bash
html2pdf content.html --scale 0.9 --margin-left 10mm --margin-right 10mm
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/yourusername/html2pdf/issues).