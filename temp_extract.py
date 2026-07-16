from pypdf import PdfReader
path = 'assets/files/Resumev2.pdf'
reader = PdfReader(path)
print('pages', len(reader.pages))
for i, page in enumerate(reader.pages[:8]):
    text = page.extract_text() or ''
    print(f'--- PAGE {i+1} ---')
    print(text[:4000])
    print()
