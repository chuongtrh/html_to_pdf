## html_to_pdf
Generate a simple PDF invoice from HTML using [puppeteer](https://github.com/GoogleChrome/puppeteer) & [handlebars](http://handlebarsjs.com/)

![Invoice](https://raw.githubusercontent.com/chuongtrh/html_to_pdf/master/screenshot/invoice.png)
## Introduce
- [Puppeteer](https://github.com/GoogleChrome/puppeteer) 
> Puppeteer is Node.js library giving you access to a headless Chrome browser. This makes it a breeze to generate PDF files with Node.js

- [Handlebars](http://handlebarsjs.com/)
> Handlebars provides the power necessary to let you build semantic templates effectively with no frustration

## How to use
- Run `npm install` to install package in package.json
- Run `node pdf.js` to generate invoice.pdf
## The PDF Invoice from HTML
1. Prepare content html (invoice.html)
2. Using handlebars to binding data to content html
3. Using Puppeteer to generate pdf from final html
```js
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

(async () => {

    var dataBinding = {
        items: [{
                name: "item 1",
                price: 100
            },
            {
                name: "item 2",
                price: 200
            },
            {
                name: "item 3",
                price: 300
            }
        ],
        total: 600,
        isWatermark: false
    }
    
    var templateHtml = fs.readFileSync(path.join(process.cwd(), 'invoice.html'), 'utf8');
    var template = handlebars.compile(templateHtml);
    var finalHtml = template(dataBinding);
    var options = {
        format: 'A4',
        headerTemplate: "<p></p>",
        footerTemplate: "<p></p>",
        displayHeaderFooter: false,
        margin: {
            top: "40px",
            bottom: "100px"
        },
        printBackground: true,
        path: 'invoice.pdf'
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(`data:text/html,${finalHtml}`, {
        waitUntil: 'networkidle0'
    });
    await page.pdf(options);
    await browser.close();
})();
```

## How to display paid stamp watermark on invoice?
Using handlebars to check param `isWatermark`
```js
  {{#if isWatermark}}
    <div style="border-width: 6px;border-style: solid; border-color: #008000;border-radius: 8px; color: #008000; opacity:0.6; position: absolute; z-index: 1; left:40%; top:30%; font-size: 60pt;-webkit-transform: rotate(-45deg);-ms-transform: rotate(-45deg);transform: rotate(-45deg); font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;">
        PAID </div>
    {{/if}}
```

Change `isWatermark: true` and run `node pdf.js` again
![Invoice with stamp paid watermark](https://raw.githubusercontent.com/chuongtrh/html_to_pdf/master/screenshot/invoice_paid.png)

## License
html_to_pdf is available under the MIT license. See the LICENSE file for more info.
