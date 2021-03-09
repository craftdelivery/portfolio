import jsonMarkup from 'json-markup'

export default data => `
  <html>
    <head>
      <style>
        .json-markup {
          line-height: 17px;
          font-size: 13px;
          font-family: monospace;
          white-space: pre;
        }
        .json-markup-key {
          font-weight: bold;
        }
        .json-markup-bool {
          color: firebrick;
        }
        .json-markup-string {
          color: green;
        }
        .json-markup-null {
          color: gray;
        }
        .json-markup-number {
          color: blue;
        }
      </style>
    </head>
    <body>
      ${jsonMarkup(data)}
    </body>
  </html>`