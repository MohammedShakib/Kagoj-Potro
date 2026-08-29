import type { ComponentType, SVGProps } from "react";

export type KagojIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string;
};

function BaseIcon({
  size = 32,
  className,
  title,
  children,
  ...props
}: KagojIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

function Sheet({
  x,
  y,
  w,
  h,
  fold = true,
  opacity = 0.18,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fold?: boolean;
  opacity?: number;
}) {
  const foldSize = fold ? Math.min(4, w * 0.28) : 0;

  return (
    <>
      <path
        d={`M${x + 2.6} ${y}h${w - 2.6 - foldSize}l${foldSize} ${foldSize}v${h - foldSize - 2.6}a2.6 2.6 0 0 1-2.6 2.6H${x + 2.6}a2.6 2.6 0 0 1-2.6-2.6V${y + 2.6}A2.6 2.6 0 0 1 ${x + 2.6} ${y}Z`}
        fill="currentColor"
        fillOpacity={opacity}
      />
      {fold ? <path d={`M${x + w - foldSize} ${y}v${foldSize}h${foldSize}`} /> : null}
    </>
  );
}

function Badge({
  x,
  y,
  w,
  label,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height="5.3" rx="2.65" fill="currentColor" fillOpacity="0.18" />
      <text
        x={x + w / 2}
        y={y + 3.6}
        fill="currentColor"
        stroke="none"
        textAnchor="middle"
        fontSize="3.5"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        {label}
      </text>
    </>
  );
}

function CornerArrow({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <>
      <path d={`M${x1} ${y1}H${x2}V${y2}`} />
      <path d={`M${x2 - 2.5} ${y2}H${x2}V${y2 - 2.5}`} />
    </>
  );
}

function PictureTile({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width="10.4" height="8.4" rx="2.2" fill="currentColor" fillOpacity="0.18" />
      <circle cx={x + 2.4} cy={y + 2.4} r="0.9" fill="currentColor" stroke="none" />
      <path d={`M${x + 1.6} ${y + 6.5}l2.3-2.4 2 1.8 2.2-2.2 2.3 2.8`} />
    </>
  );
}

function MiniCard({
  x,
  y,
  rotate,
}: {
  x: number;
  y: number;
  rotate?: number;
}) {
  return (
    <g transform={rotate ? `rotate(${rotate} ${x + 4.8} ${y + 5.8})` : undefined}>
      <rect x={x} y={y} width="9.6" height="11.6" rx="2.6" fill="currentColor" fillOpacity="0.18" />
      <CornerArrow x1={x + 2.3} y1={y + 3.3} x2={x + 7.2} y2={y + 8.2} />
    </g>
  );
}

export function PdfToJpgIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.2} y={4.6} w={13.6} h={18.6} />
      <path d="M9.7 11.1h6.5" />
      <path d="M9.7 14.6h5.1" />
      <PictureTile x={15.6} y={14.9} />
      <Badge x={15.1} y={23.1} w={10} label="JPG" />
    </BaseIcon>
  );
}

export function PdfToPngIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.2} y={4.6} w={13.6} h={18.6} />
      <path d="M9.7 11.1h6.5" />
      <path d="M9.7 14.6h5.1" />
      <PictureTile x={15.6} y={14.9} />
      <path d="M22.8 12.4v4.2" />
      <path d="M20.7 14.5H25" />
      <Badge x={14.6} y={23.1} w={11} label="PNG" />
    </BaseIcon>
  );
}

export function ImageToPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="6" y="7.2" width="10.8" height="8.8" rx="2.4" fill="currentColor" fillOpacity="0.18" />
      <circle cx="8.6" cy="9.9" r="0.95" fill="currentColor" stroke="none" />
      <path d="M7.4 13.5 9.9 11l2 1.8 2.2-2.3 2 3" />
      <Sheet x={13.8} y={8.8} w={12.6} h={16.6} opacity={0.16} />
      <Badge x={15.6} y={19.8} w={7.4} label="PDF" />
    </BaseIcon>
  );
}

export function MergePdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <MiniCard x={5.2} y={6.2} rotate={-6} />
      <MiniCard x={17.2} y={6.2} rotate={6} />
      <MiniCard x={11.2} y={16.4} />
      <path d="M11.7 15.9 14 18.2" />
      <path d="M20.3 15.9 18 18.2" />
      <path d="M16 13.8v3.1" />
    </BaseIcon>
  );
}

export function SplitPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <MiniCard x={11.2} y={4.6} />
      <MiniCard x={5.2} y={16.4} rotate={-6} />
      <MiniCard x={17.2} y={16.4} rotate={6} />
      <path d="M16 15v3.1" />
      <path d="M13.9 17.8 11.4 20" />
      <path d="M18.1 17.8 20.6 20" />
    </BaseIcon>
  );
}

export function RotatePdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={9.2} y={7} w={13.4} h={17.6} />
      <path d="M10.6 21.3a8.5 8.5 0 1 1 10.6-10.9" />
      <path d="M21.3 7.4h4.2v4.2" />
    </BaseIcon>
  );
}

export function CompressPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={8.1} y={5.4} w={15.8} h={20} />
      <path d="M16 9.2v4" />
      <path d="M16 22.8v-4" />
      <path d="M9.7 16h4" />
      <path d="M22.3 16h-4" />
      <path d="m16 9.2-1.9 1.9" />
      <path d="m16 9.2 1.9 1.9" />
      <path d="m16 22.8-1.9-1.9" />
      <path d="m16 22.8 1.9-1.9" />
      <path d="m9.7 16 1.9-1.9" />
      <path d="m9.7 16 1.9 1.9" />
      <path d="m22.3 16-1.9-1.9" />
      <path d="m22.3 16-1.9 1.9" />
    </BaseIcon>
  );
}

export function WatermarkIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={8.1} y={5.4} w={15.8} h={20} />
      <path d="M10.8 21.5 21.8 10.5" />
      <circle cx="20.8" cy="20.2" r="3" fill="currentColor" fillOpacity="0.18" />
      <path d="M20.8 17.9v4.6" />
      <path d="M18.5 20.2h4.6" />
    </BaseIcon>
  );
}

export function PageNumbersIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={8.1} y={5.4} w={15.8} h={20} />
      <rect x="10.7" y="10.1" width="4.6" height="4.6" rx="1.6" fill="currentColor" fillOpacity="0.18" />
      <rect x="17.3" y="14" width="4.6" height="4.6" rx="1.6" fill="currentColor" fillOpacity="0.18" />
      <rect x="10.7" y="18.1" width="4.6" height="4.6" rx="1.6" fill="currentColor" fillOpacity="0.18" />
      <text x="13" y="13.3" fill="currentColor" stroke="none" textAnchor="middle" fontSize="3.3" fontWeight="700" fontFamily="Arial, sans-serif">1</text>
      <text x="19.6" y="17.2" fill="currentColor" stroke="none" textAnchor="middle" fontSize="3.3" fontWeight="700" fontFamily="Arial, sans-serif">2</text>
      <text x="13" y="21.4" fill="currentColor" stroke="none" textAnchor="middle" fontSize="3.3" fontWeight="700" fontFamily="Arial, sans-serif">3</text>
    </BaseIcon>
  );
}

export function OrganizePdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="6.1" y="7" width="7.6" height="7.6" rx="2.2" fill="currentColor" fillOpacity="0.18" />
      <rect x="18.3" y="7" width="7.6" height="7.6" rx="2.2" fill="currentColor" fillOpacity="0.18" />
      <rect x="6.1" y="18.2" width="7.6" height="7.6" rx="2.2" fill="currentColor" fillOpacity="0.18" />
      <rect x="18.3" y="18.2" width="7.6" height="7.6" rx="2.2" fill="currentColor" fillOpacity="0.18" />
      <path d="M14.9 10.8h2.4" />
      <path d="m15.9 9.8 1.4 1-1.4 1" />
      <path d="M17.1 22H14.7" />
      <path d="m16.1 21-1.4 1 1.4 1" />
    </BaseIcon>
  );
}

export function ExtractPagesIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.4} y={7.1} w={11.2} h={15.8} opacity={0.12} />
      <Sheet x={10.1} y={5.1} w={11.2} h={15.8} opacity={0.18} />
      <Sheet x={18.2} y={10.8} w={8.2} h={11.2} opacity={0.18} />
      <path d="M17 15.6h4.5" />
      <path d="m19.6 13.4 2.2 2.2-2.2 2.2" />
    </BaseIcon>
  );
}

export function LocalProcessingIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4.8" y="7" width="22.4" height="13.9" rx="3.8" fill="currentColor" fillOpacity="0.16" />
      <path d="M9 11h14" />
      <path d="M12.1 24.5h7.8" />
      <path d="M16 20.9v3.6" />
      <rect x="12.2" y="11.6" width="7.6" height="6.6" rx="1.8" fill="currentColor" fillOpacity="0.22" />
      <path d="M14.5 13.8h3" />
      <path d="M14.5 16h3" />
      <path d="M10.7 13.3h1.2" />
      <path d="M10.7 16.5h1.2" />
      <path d="M20.1 13.3h1.2" />
      <path d="M20.1 16.5h1.2" />
      <path d="M14.2 10.1v1.3" />
      <path d="M17.8 10.1v1.3" />
      <path d="M14.2 18.4v1.3" />
      <path d="M17.8 18.4v1.3" />
    </BaseIcon>
  );
}

export function NoStorageIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <ellipse cx="16" cy="9.4" rx="6.3" ry="2.5" fill="currentColor" fillOpacity="0.18" />
      <path d="M9.7 9.4V18c0 1.5 2.8 2.7 6.3 2.7s6.3-1.2 6.3-2.7V9.4" />
      <path d="M9.7 13.8c0 1.5 2.8 2.7 6.3 2.7s6.3-1.2 6.3-2.7" />
      <path d="M9.7 18.1c0 1.5 2.8 2.7 6.3 2.7s6.3-1.2 6.3-2.7" />
      <path d="M7 24.6 25 6.6" />
      <path d="M22.7 8.8l1.9-1.8" />
    </BaseIcon>
  );
}

export function NoAccountIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="6.1" y="8" width="15.4" height="10.8" rx="3" fill="currentColor" fillOpacity="0.16" />
      <circle cx="11.1" cy="12.3" r="2.2" fill="currentColor" fillOpacity="0.24" />
      <path d="M8.7 17c.7-1.7 1.8-2.5 3-2.5 1.1 0 2.2.8 2.9 2.5" />
      <path d="M16 11.4h3.2" />
      <path d="M16 14.8h4.3" />
      <circle cx="23.1" cy="20.3" r="3.7" fill="currentColor" fillOpacity="0.18" />
      <path d="m21.3 20.4 1.2 1.2 2.3-2.4" />
    </BaseIcon>
  );
}

export function FastIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5.1 12.1h7" />
      <path d="M4.4 16h5.4" />
      <path d="M5.5 19.9h6.2" />
      <circle cx="17.4" cy="16.1" r="7.3" fill="currentColor" fillOpacity="0.16" />
      <path d="m16.6 10.1 4.3.2-2.4 4.7h3.5l-6.8 7.2 1.8-5.2h-3.7Z" fill="currentColor" fillOpacity="0.24" />
    </BaseIcon>
  );
}

export function PrivateIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M16 6.2c3 2.2 6.1 3.4 9.3 3.7v5.4c0 6.2-3.6 9.9-9.3 11.9-5.7-2-9.3-5.7-9.3-11.9V9.9c3.2-.3 6.3-1.5 9.3-3.7Z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path
        d="M16 10.3c2 1.5 4 2.3 6.1 2.5v3c0 4.3-2.4 6.9-6.1 8.3-3.8-1.4-6.1-4-6.1-8.3v-3c2.1-.2 4.1-1 6.1-2.5Z"
        fill="currentColor"
        fillOpacity="0.24"
      />
      <rect x="12.6" y="15.2" width="6.8" height="5.6" rx="1.8" />
      <path d="M14.3 15.1v-1a1.7 1.7 0 1 1 3.4 0v1" />
    </BaseIcon>
  );
}

export function SimpleIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="7.1" y="8.5" width="17.8" height="4.2" rx="2.1" fill="currentColor" fillOpacity="0.18" />
      <rect x="7.1" y="14.6" width="13.6" height="4" rx="2" fill="currentColor" fillOpacity="0.18" />
      <rect x="7.1" y="20.3" width="10" height="4" rx="2" fill="currentColor" fillOpacity="0.18" />
      <path d="M22.3 8.2 23.5 11l2.8 1.3-2.8 1.3-1.2 2.7-1.3-2.7-2.8-1.3L21 11Z" fill="currentColor" fillOpacity="0.24" />
    </BaseIcon>
  );
}

export function SignPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.6} y={5} w={13.2} h={19.6} />
      <path d="M10 18c2-1 3-3 5-1.5 1 1-1 3 2 3" />
      <path d="m18 15 3-3-1.5-1.5-3 3" />
    </BaseIcon>
  );
}

export function EditPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.6} y={5} w={13.2} h={19.6} />
      <rect x="10" y="10" width="6.6" height="4.6" rx="1" fill="currentColor" fillOpacity="0.18" />
      <path d="M10 17h6.6" />
      <path d="M10 20h4" />
    </BaseIcon>
  );
}

export function CropPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.6} y={5} w={13.2} h={19.6} />
      <path d="M10.5 11v7.5h7.5" />
      <path d="M15.5 19.5v-7.5h-7.5" />
    </BaseIcon>
  );
}

export function FillPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.6} y={5} w={13.2} h={19.6} />
      <rect x="9.5" y="11" width="3.5" height="3.5" rx="0.8" fill="currentColor" fillOpacity="0.18" />
      <path d="M14.5 12.7h5" />
      <rect x="9.5" y="16" width="3.5" height="3.5" rx="0.8" fill="currentColor" fillOpacity="0.18" />
      <path d="M14.5 17.7h5" />
    </BaseIcon>
  );
}

export function OcrPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      {/* Document Base */}
      <Sheet x={6.6} y={5} w={13.2} h={19.6} opacity={0.12} />
      {/* Scan Corners */}
      <path d="M5 8v-3h3" />
      <path d="M18.4 5h3v3" />
      <path d="M5 21.6v3h3" />
      <path d="M18.4 24.6h3v-3" />
      {/* Scanning Beam (Line across the middle) */}
      <path d="M3.5 14.8h19.4" strokeOpacity={0.4} />
      {/* Small Text Lines representing recognized text */}
      <path d="M9.5 9h7" />
      <path d="M9.5 12h5" />
      <path d="M9.5 18h7" />
      <path d="M9.5 21h4" />
    </BaseIcon>
  );
}

export const KAGOJ_ICONS: Record<string, ComponentType<KagojIconProps>> = {
  pdfToJpg: PdfToJpgIcon,
  pdfToPng: PdfToPngIcon,
  imageToPdf: ImageToPdfIcon,
  mergePdf: MergePdfIcon,
  splitPdf: SplitPdfIcon,
  rotatePdf: RotatePdfIcon,
  compressPdf: CompressPdfIcon,
  watermarkPdf: WatermarkIcon,
  pageNumbers: PageNumbersIcon,
  organizePdf: OrganizePdfIcon,
  extractPages: ExtractPagesIcon,
  localProcessing: LocalProcessingIcon,
  noStorage: NoStorageIcon,
  noAccount: NoAccountIcon,
  fast: FastIcon,
  private: PrivateIcon,
  simple: SimpleIcon,
  signPdf: SignPdfIcon,
  editPdf: EditPdfIcon,
  cropPdf: CropPdfIcon,
  fillPdf: FillPdfIcon,
  ocrPdf: OcrPdfIcon,
};
