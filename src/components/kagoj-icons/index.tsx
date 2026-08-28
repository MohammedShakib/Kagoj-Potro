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

export function ProtectPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.6} y={5} w={13.2} h={19.6} />
      <path
        d="M21.7 15.1c2 0 3.8-.6 5.1-1.7 0 5-1.8 8-5.1 9.9-3.4-1.9-5.2-4.9-5.2-9.9 1.3 1.1 3.2 1.7 5.2 1.7Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M21.7 18.1v3.4" />
      <path d="M20 17.2v-.5a1.7 1.7 0 0 1 3.4 0v.5" />
    </BaseIcon>
  );
}

export function LocalProcessingIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="5.1" y="7.3" width="21.8" height="13.8" rx="3.8" fill="currentColor" fillOpacity="0.18" />
      <path d="M11.6 24.6h8.8" />
      <path d="M16 21.1v3.5" />
      <path d="M10.3 13.8h5.2" />
      <path d="M9.1 16.9h3.6" />
      <rect x="18.2" y="10.7" width="5.8" height="5.8" rx="1.8" fill="currentColor" fillOpacity="0.18" />
      <path d="M21.1 9v1.3" />
      <path d="M21.1 16.9v1.3" />
      <path d="M17.3 13.6h1.3" />
      <path d="M24.9 13.6h1.3" />
    </BaseIcon>
  );
}

export function NoStorageIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={5.4} y={5.4} w={10.8} h={15.8} opacity={0.16} />
      <ellipse cx="22.8" cy="11.3" rx="4.2" ry="2" fill="currentColor" fillOpacity="0.18" />
      <path d="M18.6 11.3v7.6c0 1.1 1.9 2 4.2 2s4.2-.9 4.2-2v-7.6" />
      <path d="M18.6 15.1c0 1.1 1.9 2 4.2 2s4.2-.9 4.2-2" />
      <path d="M7.1 24.7 25.9 6.3" />
    </BaseIcon>
  );
}

export function NoAccountIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12.8" cy="11.8" r="4.4" fill="currentColor" fillOpacity="0.18" />
      <path d="M6.7 23.2c1.1-3.4 3.6-5.2 6.1-5.2 2.6 0 5 1.8 6.1 5.2" />
      <circle cx="23.1" cy="20.4" r="3.7" fill="currentColor" fillOpacity="0.18" />
      <path d="m21.3 20.4 1.2 1.2 2.3-2.4" />
    </BaseIcon>
  );
}

export function FastIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={7.1} y={5.2} w={12.8} h={18.9} opacity={0.16} />
      <path d="M4.9 12.1h4.4" />
      <path d="M4.2 15.8h3.8" />
      <path d="M5.2 19.4h4.4" />
      <path d="m19.7 12 3.2.1-1.9 4h3.1l-5.1 7.7 1.1-5.2h-3Z" fill="currentColor" fillOpacity="0.18" />
    </BaseIcon>
  );
}

export function PrivateIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={6.9} y={5} w={12.9} h={19.4} opacity={0.16} />
      <path
        d="M22.4 14.8c1.8 0 3.4-.5 4.7-1.5 0 4.7-1.7 7.6-4.7 9.3-3.1-1.7-4.8-4.6-4.8-9.3 1.3 1 2.9 1.5 4.8 1.5Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="m20.8 19.3 1.2 1.2 2.5-2.5" />
    </BaseIcon>
  );
}

export function SimpleIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Sheet x={7} y={5.2} w={13.2} h={18.9} opacity={0.16} />
      <path d="M11.3 13.1h6.2" />
      <path d="M11.3 17h8.5" />
      <path d="M22.9 9.3 24 11.5l2.4 1.2-2.4 1.1-1.1 2.3-1.1-2.3-2.4-1.1 2.4-1.2Z" fill="currentColor" fillOpacity="0.18" />
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
  protectPdf: ProtectPdfIcon,
  localProcessing: LocalProcessingIcon,
  noStorage: NoStorageIcon,
  noAccount: NoAccountIcon,
  fast: FastIcon,
  private: PrivateIcon,
  simple: SimpleIcon,
};
