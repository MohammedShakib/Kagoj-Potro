import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFOptionList } from "pdf-lib";

export interface FormFieldData {
  name: string;
  type: "text" | "checkbox" | "radio" | "dropdown" | "optionList" | "other";
  value: string | boolean | string[] | null;
  options?: string[]; // For dropdowns/radios
}

export async function getFormFields(file: File): Promise<FormFieldData[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();
  
  if (!form) return [];

  const fields = form.getFields();
  const formData: FormFieldData[] = [];

  for (const field of fields) {
    const name = field.getName();
    
    if (field instanceof PDFTextField) {
      formData.push({ name, type: "text", value: field.getText() || "" });
    } else if (field instanceof PDFCheckBox) {
      formData.push({ name, type: "checkbox", value: field.isChecked() });
    } else if (field instanceof PDFRadioGroup) {
      formData.push({ 
        name, 
        type: "radio", 
        value: field.getSelected() || null, 
        options: field.getOptions() 
      });
    } else if (field instanceof PDFDropdown) {
      formData.push({ 
        name, 
        type: "dropdown", 
        value: field.getSelected() || null, 
        options: field.getOptions() 
      });
    } else if (field instanceof PDFOptionList) {
      formData.push({ 
        name, 
        type: "optionList", 
        value: field.getSelected() || null, 
        options: field.getOptions() 
      });
    } else {
      formData.push({ name, type: "other", value: null });
    }
  }

  return formData;
}

export async function fillForm(
  file: File, 
  data: Record<string, string | boolean | string[]>, 
  flatten: boolean = false
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();

  if (form) {
    for (const [name, value] of Object.entries(data)) {
      try {
        const field = form.getField(name);
        if (!field) continue;

        if (field instanceof PDFTextField && typeof value === "string") {
          field.setText(value);
        } else if (field instanceof PDFCheckBox && typeof value === "boolean") {
          value ? field.check() : field.uncheck();
        } else if (field instanceof PDFRadioGroup && typeof value === "string") {
          field.select(value);
        } else if (field instanceof PDFDropdown) {
          if (typeof value === "string") {
            field.select(value);
          } else if (Array.isArray(value)) {
            field.select(value[0]); // Dropdowns usually only take one unless multi-select
          }
        } else if (field instanceof PDFOptionList) {
          if (typeof value === "string") {
            field.select(value);
          } else if (Array.isArray(value)) {
            field.select(value);
          }
        }
      } catch (err) {
        console.warn(`Failed to set field ${name}:`, err);
      }
    }

    if (flatten) {
      form.flatten();
    }
  }

  return await pdfDoc.save();
}
