# Contributing


## Global Documentation Style & Formatting Guidelines

The following guidelines should be followed when writing documentation:

### Tone and language
- neutral, factual, engineering tone  
- grade-8 readability (short sentences and paragraphs, without oversimplifying technical content)  
- no adjectives, hubris, or subjective language  
- do not add bold emphasis unless specifically requested  
- avoid emphasis formatting (bold/italics) for “eye-candy”; 
- headings and lists convey structure  

### Headings and domain references
- domain names in body text: uppercase and enclosed in backticks (e.g. `DIGITAL` domain)  
- domain names in headings: uppercase and italicised with underscores (e.g. ### _DIGITAL_ Domain)  

### Nets, signals, and GPIO labels
- global GPIO labels: enclosed in brackets and backticks, linking to quick_reference.md (e.g. \[`I2C_SDA`\](../../quick_reference.md))  
- other nets and ground references: enclosed in backticks only (e.g. `GNDREF`, `NET-H`)  

### Numbers and units
- SI units with a space between value and unit (e.g. 3.3 V, 245 mA)  
- comma separators for thousands (e.g. 1,042 Hz)  

### Lists
- do not capitalise the first word unless a proper noun  
- end all items except the last with a semicolon  
- end the second item with a semicolon and ‘and’  
- end the last item with a full stop  
- avoid nested lists; instead use sub-headings for structure  

### Inline citations
- text must include inline citations and/or references as hyperlinks  
- examples of items requiring citations: standards, research documents, referenced web content, datasheets for key components  
- anchors for inline citations can be natural text that flows in the sentence, not necessarily the full reference title  
- inline citations should only appear once, at the first occurrence in the text  

## References section
- all inline references must also be listed in a References section at the bottom of the page  
- format in IEEE style with the *title italicised* and hyperlinked  
- do not use quotation marks around the title  
- structure:  
  - author’s name listed as first initial of first name, then full last,  
  - \[*title as hyperlink*\](url), 
  - publisher or journal/book name,  
  - year (published or accessed)  

*Example*

The following markdown example shows how the format is achieved:

```markdown
1. European Union, [*Directive 2014/30/EU on electromagnetic compatibility (EMC)*](https://eur-lex.europa.eu/eli/dir/2014/30/oj), Official Journal of the European Union, 2014  

```

And this is the result in the web page:

1. European Union, [*Directive 2014/30/EU on electromagnetic compatibility (EMC)*](https://eur-lex.europa.eu/eli/dir/2014/30/oj), Official Journal of the European Union, 2014  

### Images and figures
- there is a top-level `assets` folder with subfolders:
  - `assets/images/` for images  
  - `assets/pdf/` for PDF documents  
  - `assets/include/` for HTM and markdown snippets that can be inserted in multiple pages e.g. `\{% include-markdown "../assets/include/filename.html" %\}`  
- each product has its own `assets/` folder, with subfolders:  
  - `assets/images/` for images  
  - `assets/pdf/` for PDF documents  
  - `assets/include/` for HTM and markdown snippets that can be inserted in multiple pages e.g. `\{% include-markdown "../assets/include/filename.html" %\}`  
- figures and plots use Matplotlib with a clean style consistent with documentation  
- primary trace color: amber (#f59e0b); reference traces: green dotted (#22c55e)  
- title large and clear; axis labels concise; dotted grid  
- range/marker labels inside the chart area  
- figure size ~9×5.2 in, DPI ≥200  
- use 50 Ω-referenced S-parameters (|S21|) for network attenuation plots with divider de-embedded  

### Structure and navigation
- documentation organized according to MkDocs nav structures defined for each product  
- consistency with canonical `mkdocs.yml` structure across products (e.g. MDD400, WTI400, EMCBench CAN-LISN)  

### Tables
- use `<colgroup>` and `class="centered"` for alignment  
- use ✅, ❌, and N/A consistently  
- footnotes under table in `<span class="footnote">` elements (on one line each, no extra breaks)  

### Footnotes
- wrapped in `<span class="footnote">`  
- style in custom.css for smaller font  

### Figures and plots
- stored in `assets/images/`  
- Matplotlib style, consistent with docs  
- amber (#f59e0b) = primary trace  
- green dotted (#22c55e) = reference trace  
- figure size ~9×5.2 in, DPI ≥200  
- labels concise, grid dotted  
- marker/range labels inside chart  

### Assets structure
- `assets/images/` for images  
- `assets/pdf/` for PDF documents  
- `assets/include/` for reusable HTML/MD snippets  

### Navigation
- follow canonical `mkdocs.yml` structure for each product (MDD400, WTI400, EMCBench CAN-LISN)  

