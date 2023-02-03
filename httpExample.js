// This code is a router post request that is used to create a PDF file from a given XML file.
// It reads the XML file and parses it with xml2js.
// It then uses the requestor 'language' and 'brand' from the request headers as an example of how to update the parsed XML object.
// The updated object is then converted back into an XML string and used as data binding for an HTML template.
// The HTML template is then converted into a PDF file using htmltopdf, which also uses header and footer templates, and some formatting options such as page size, margins, etc.
// The PDF file is encoded into base64 format and sent back in the response.

router.post('/downloadCurrent', (req, res, next) => {

    let xmlfile = path.resolve(__dirname, '../bindingDataItems.xml')
    let basePath = path.resolve(__dirname, '../pdfTemplate.handlebars')
    let baseheaderPath = path.resolve(__dirname, '../pdfHeaderTemplate.handlebars')
    let basefooterPath = path.resolve(__dirname, '../pdfFooterTemplate.handlebars')

    let optionsFs = { encoding: "utf8" }

    let xml = fs.readFileSync(xmlfile, optionsFs);
    let baseTemplate = fs.readFileSync(basePath, optionsFs);
    let headerTemplate = fs.readFileSync(baseheaderPath, optionsFs);
    let footerTemplate = fs.readFileSync(basefooterPath, optionsFs);


    xml2js.parseString(xml, function (err, result) {
        if (err) console.log(err);

        result.gwdp.requestorLanguage = req.headers.language;
        result.gwdp.requestorBrand = req.headers.brand;

        let builder = new xml2js.Builder();

        let mergedXMLString = builder.buildObject(result);

        try {
            (async () => {
                const dataBinding = mergedXMLString;
                const templateHtml = baseTemplate;

                const options = {
                    format: "A4",
                    headerTemplate: headerTemplate,
                    footerTemplate: footerTemplate,
                    displayHeaderFooter: true,
                    margin: {
                        top: "40px",
                        bottom: "100px",
                    },
                    printBackground: true,

                };

                let returnedFile = await html_to_pdf({ templateHtml, dataBinding, options });

                const file = `data:application/pdf;base64, ${Buffer.from(returnedFile).toString("base64")}`;
                res.setHeader("Content-Type", "application/pdf");
                res.send(file);
                console.log("Done: invoice.pdf is created!");
            })();
        } catch (err) {
            console.log("ERROR:", err);
        }


    });

})