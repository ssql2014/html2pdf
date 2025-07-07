#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <input.html> [options]')
  .command('$0 <input>', 'Convert HTML to PDF', (yargs) => {
    yargs.positional('input', {
      describe: 'Input HTML file path',
      type: 'string'
    });
  })
  .option('output', {
    alias: 'o',
    describe: 'Output PDF file path',
    type: 'string'
  })
  .option('format', {
    alias: 'f',
    describe: 'Page format',
    choices: ['A4', 'A3', 'Letter', 'Legal', 'Tabloid'],
    default: 'A4'
  })
  .option('landscape', {
    alias: 'l',
    describe: 'Use landscape orientation',
    type: 'boolean',
    default: false
  })
  .option('margin-top', {
    describe: 'Top margin',
    type: 'string',
    default: '0'
  })
  .option('margin-bottom', {
    describe: 'Bottom margin',
    type: 'string',
    default: '0'
  })
  .option('margin-left', {
    describe: 'Left margin',
    type: 'string',
    default: '0'
  })
  .option('margin-right', {
    describe: 'Right margin',
    type: 'string',
    default: '0'
  })
  .option('background', {
    alias: 'b',
    describe: 'Print background graphics',
    type: 'boolean',
    default: true
  })
  .option('scale', {
    describe: 'Scale of the webpage rendering',
    type: 'number',
    default: 1
  })
  .option('width', {
    alias: 'w',
    describe: 'Paper width (overrides format)',
    type: 'string'
  })
  .option('height', {
    alias: 'h',
    describe: 'Paper height (overrides format)',
    type: 'string'
  })
  .option('wait', {
    describe: 'Wait time in milliseconds before generating PDF',
    type: 'number',
    default: 1000
  })
  .option('css', {
    describe: 'Additional CSS to inject',
    type: 'string'
  })
  .option('header', {
    describe: 'Display header with title and date',
    type: 'boolean',
    default: false
  })
  .option('footer', {
    describe: 'Display footer with page numbers',
    type: 'boolean',
    default: false
  })
  .option('range', {
    describe: 'Page ranges to print, e.g., "1-5, 8, 11-13"',
    type: 'string'
  })
  .option('prefer-css-page-size', {
    describe: 'Use CSS-defined page size',
    type: 'boolean',
    default: false
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .argv;

async function convertHTMLToPDF(options) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });

    // Navigate to the HTML file
    const htmlPath = path.resolve(options.input);
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`Input file not found: ${htmlPath}`);
    }

    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });

    // Inject additional CSS if provided
    if (options.css) {
      await page.addStyleTag({ content: options.css });
    }

    // Add print media CSS to ensure proper rendering
    await page.addStyleTag({
      content: `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `
    });

    // Wait for any animations or dynamic content
    await page.waitForTimeout(options.wait);

    // Prepare PDF options
    const pdfOptions = {
      path: options.output,
      format: options.format,
      landscape: options.landscape,
      printBackground: options.background,
      scale: options.scale,
      margin: {
        top: options['margin-top'],
        bottom: options['margin-bottom'],
        left: options['margin-left'],
        right: options['margin-right']
      },
      displayHeaderFooter: options.header || options.footer,
      preferCSSPageSize: options['prefer-css-page-size']
    };

    // Add custom dimensions if provided
    if (options.width && options.height) {
      pdfOptions.width = options.width;
      pdfOptions.height = options.height;
      delete pdfOptions.format;
    }

    // Add page range if provided
    if (options.range) {
      pdfOptions.pageRanges = options.range;
    }

    // Add header/footer templates if requested
    if (pdfOptions.displayHeaderFooter) {
      if (options.header) {
        pdfOptions.headerTemplate = `
          <div style="font-size: 10px; width: 100%; text-align: center;">
            <span class="title"></span>
          </div>
        `;
      }
      if (options.footer) {
        pdfOptions.footerTemplate = `
          <div style="font-size: 10px; width: 100%; text-align: center;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `;
      }
    }

    // Generate PDF
    await page.pdf(pdfOptions);

    console.log(`✅ PDF generated successfully: ${options.output}`);
    
    // Get file size
    const stats = fs.statSync(options.output);
    console.log(`📄 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  // Set output filename if not provided
  if (!argv.output) {
    const inputBase = path.basename(argv.input, path.extname(argv.input));
    argv.output = `${inputBase}.pdf`;
  }

  // Make output path absolute
  argv.output = path.resolve(argv.output);

  console.log(`📄 Converting ${argv.input} to PDF...`);
  console.log(`⚙️  Settings: ${argv.format} ${argv.landscape ? 'landscape' : 'portrait'}, margins: ${argv['margin-top']}/${argv['margin-right']}/${argv['margin-bottom']}/${argv['margin-left']}`);

  await convertHTMLToPDF(argv);
})();