# 📄 Kagoj Potro

<div align="center">
  <img src="public/kagoj%20potro%20full%20logo.png" alt="Kagoj Potro Banner" width="400" />
</div>

**Kagoj Potro** is a blazing-fast, privacy-first PDF and document utility platform built for the modern web. Every tool runs directly inside your browser using WebAssembly and Web Workers—meaning your sensitive documents **never leave your device**.

---

## ✨ Features

Kagoj Potro is packed with a massive suite of document tools, categorized into intuitive workspaces:

### 🔄 Convert
- **PDF to JPG / PNG:** Extract every page of a PDF into high-quality images.
- **Image to PDF:** Combine multiple images (JPEG, PNG, etc.) into a single, clean PDF.

### 📑 Organize
- **Merge PDF:** Combine multiple PDFs into a single document in seconds.
- **Split PDF:** Break a large PDF into individual pages or extract specific page ranges.
- **Extract Pages:** Pull only the pages you need from a document.
- **Delete Pages:** Quickly remove unwanted pages from any PDF.
- **Rotate PDF:** Fix upside-down or sideways pages.

### ⚡ Optimize
- **Compress PDF:** Reduce file size while keeping your document perfectly readable using WASM-powered intelligent compression.
- **OCR PDF:** Recognize text in scanned PDFs and create searchable documents with invisible text layers (`tesseract.js`).

### 🛡️ Security & Editing
- **Protect PDF:** Add a password to keep your document secure.
- **Unlock PDF:** Remove passwords from PDFs (if you know the original password).
- **Watermark PDF:** Stamp text across your documents.
- **Page Numbers:** Add customizable page numbers.
- **Sign PDF:** Add a signature to your document seamlessly.

---

## 🔒 Privacy First

We believe your data is yours. 
- **Zero Server Processing:** We do not upload your files to our servers.
- **Local Execution:** All heavy lifting (`pdf-lib`, `tesseract.js`, image processing) happens locally in your browser's memory.
- **No Signup Required:** No accounts, no paywalls, no tracking.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Framer Motion
- **Core Document Libraries:** 
  - `pdf-lib` (Document manipulation)
  - `pdfjs-dist` (Rendering & Extraction)
  - `@quicktoolsone/pdf-compress` (Compression)
  - `tesseract.js` (Optical Character Recognition)

---

## 🛠️ Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/MohammedShakib/Kagoj-Potro.git
cd Kagoj-Potro
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a Pull Request if you'd like to add new tools or improve existing ones.

## 📝 License

This project is licensed under the MIT License.
