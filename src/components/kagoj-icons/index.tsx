import type { ComponentType, ReactNode, SVGProps } from "react";

export type KagojIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string;
};

type BaseIconProps = KagojIconProps & {
  children: ReactNode;
};

function BaseIcon({
  size = 32,
  className,
  title,
  children,
  ...props
}: BaseIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
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

function Doc({
  x = 7,
  y = 4.5,
  w = 14,
  h = 20,
  fold = true,
  fillOpacity = 0.1,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  fold?: boolean;
  fillOpacity?: number;
}) {
  const foldSize = Math.min(4, w * 0.3);

  return (
    <>
      <path
        d={`M${x + 3} ${y}h${w - 5}${fold ? `l${foldSize} ${foldSize}` : ""}v${h - (fold ? foldSize : 0) - 2.5}a2.5 2.5 0 0 1-2.5 2.5h-${w - 5}a2.5 2.5 0 0 1-2.5-2.5v-${h - 2.5}A2.5 2.5 0 0 1 ${x + 3} ${y}Z`}
        fill="currentColor"
        fillOpacity={fillOpacity}
        stroke="currentColor"
      />
      {fold ? (
        <path
          d={`M${x + w - foldSize} ${y}v${foldSize - 0.4}a1.8 1.8 0 0 0 1.8 1.8H${x + w}`}
        />
      ) : null}
    </>
  );
}

function PhotoSymbol({ x = 10, y = 10.5 }: { x?: number; y?: number }) {
  return (
    <>
      <rect x={x} y={y} width="8.5" height="6.8" rx="2.2" fill="currentColor" fillOpacity="0.1" />
      <circle cx={x + 2.3} cy={y + 2.2} r="0.9" fill="currentColor" stroke="none" />
      <path d={`M${x + 1.4} ${y + 5.9}l2.3-2.4 1.8 1.7 2.2-2.1 2.2 2.8`} />
    </>
  );
}

function MiniBadge({
  label,
  x = 17,
  y = 21.5,
  width = 8,
}: {
  label: string;
  x?: number;
  y?: number;
  width?: number;
}) {
  return (
    <>
      <rect x={x} y={y} width={width} height="4.8" rx="2.4" fill="currentColor" fillOpacity="0.12" />
      <text
        x={x + width / 2}
        y={y + 3.25}
        fill="currentColor"
        stroke="none"
        textAnchor="middle"
        fontSize="3.1"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        {label}
      </text>
    </>
  );
}

function SmallDoc({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={rotate ? `rotate(${rotate} ${x + 4} ${y + 5})` : undefined}>
      <rect x={x} y={y} width="8" height="10" rx="2" fill="currentColor" fillOpacity="0.1" />
      <path d={`M${x + 2.2} ${y + 3.2}h3.6`} />
      <path d={`M${x + 2.2} ${y + 5.2}h3.2`} />
    </g>
  );
}

export function PdfToJpgIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc />
      <PhotoSymbol />
      <MiniBadge label="JPG" x={16.7} y={21.1} width={8.8} />
    </BaseIcon>
  );
}

export function PdfToPngIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc />
      <PhotoSymbol />
      <path d="M19.8 11.2h4.2" />
      <path d="M21.9 9.1v4.2" />
      <rect x="18.6" y="18.1" width="1.8" height="1.8" rx="0.5" fill="currentColor" fillOpacity="0.18" stroke="none" />
      <rect x="20.6" y="20.1" width="1.8" height="1.8" rx="0.5" fill="currentColor" fillOpacity="0.18" stroke="none" />
      <MiniBadge label="PNG" x={15.8} y={21.1} width={10.2} />
    </BaseIcon>
  );
}

export function ImageToPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="5.5" y="8.4" width="10.6" height="8.6" rx="2.2" fill="currentColor" fillOpacity="0.08" />
      <path d="M8.1 14.3l2.3-2.2 1.6 1.5 1.9-2 1.6 2.7" />
      <circle cx="9.1" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <rect x="8.8" y="5.6" width="10.6" height="8.6" rx="2.2" fill="currentColor" fillOpacity="0.12" />
      <Doc x={15} y={10} w={10.8} h={14.2} fillOpacity={0.08} />
      <path d="M17.9 17.1h5.1" />
      <path d="M17.9 19.8h4.3" />
    </BaseIcon>
  );
}

export function MergePdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <SmallDoc x={5} y={6} rotate={-8} />
      <SmallDoc x={19} y={6} rotate={8} />
      <SmallDoc x={12} y={16} />
      <path d="M11.3 15.2l2.8 2.8" />
      <path d="M20.7 15.2l-2.8 2.8" />
      <path d="M14.2 18l-.2-3.2" />
      <path d="M17.8 18l.2-3.2" />
    </BaseIcon>
  );
}

export function SplitPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <SmallDoc x={12} y={4.8} />
      <SmallDoc x={5} y={17} rotate={-4} />
      <SmallDoc x={19} y={17} rotate={4} />
      <path d="M16 14.8v2.8" />
      <path d="M13.2 16.8 10 19.4" />
      <path d="M18.8 16.8 22 19.4" />
      <path d="M16 13.1v-1.3" />
    </BaseIcon>
  );
}

export function RotatePdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={10} y={7} w={11.6} h={15.5} fillOpacity={0.08} />
      <path d="M11.1 22.9a9.5 9.5 0 1 1 12.5-13.3" />
      <path d="M22.5 6.6h3.5v3.5" />
    </BaseIcon>
  );
}

export function CompressPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={8.5} y={5.5} w={15} h={19} fillOpacity={0.08} />
      <path d="M12 11.2h8" />
      <path d="M14.5 14.8h3" />
      <path d="M13.2 18.6h5.6" />
      <path d="M16 9.2v3.1" />
      <path d="M16 22.8v-3.1" />
      <path d="m11 16 2.7 0" />
      <path d="m21 16-2.7 0" />
      <path d="m16 9.2-1.5 1.5" />
      <path d="m16 9.2 1.5 1.5" />
      <path d="m16 22.8-1.5-1.5" />
      <path d="m16 22.8 1.5-1.5" />
      <path d="m11 16 1.6-1.6" />
      <path d="m11 16 1.6 1.6" />
      <path d="m21 16-1.6-1.6" />
      <path d="m21 16-1.6 1.6" />
    </BaseIcon>
  );
}

export function WatermarkIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={8.2} y={5.2} w={15.4} h={19.6} fillOpacity={0.08} />
      <path d="M11.5 20.5 22 10" />
      <path d="M11.1 15.2h5.4" />
      <path d="M14.2 12.2c1.7 1 3.1 1.2 4.8.6" />
      <circle cx="20.7" cy="20.1" r="2.4" fill="currentColor" fillOpacity="0.1" />
      <path d="M20.7 17.8v4.6" />
      <path d="M18.5 20.1h4.4" />
    </BaseIcon>
  );
}

export function PageNumbersIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={8.2} y={5.2} w={15.4} h={19.6} fillOpacity={0.08} />
      <circle cx="13" cy="12" r="2.1" fill="currentColor" fillOpacity="0.1" />
      <circle cx="19.3" cy="16.2" r="2.1" fill="currentColor" fillOpacity="0.1" />
      <circle cx="13" cy="20.5" r="2.1" fill="currentColor" fillOpacity="0.1" />
      <text x="13" y="13.2" fill="currentColor" stroke="none" textAnchor="middle" fontSize="3.2" fontWeight="700" fontFamily="Arial, sans-serif">1</text>
      <text x="19.3" y="17.3" fill="currentColor" stroke="none" textAnchor="middle" fontSize="3.2" fontWeight="700" fontFamily="Arial, sans-serif">2</text>
      <text x="13" y="21.7" fill="currentColor" stroke="none" textAnchor="middle" fontSize="3.2" fontWeight="700" fontFamily="Arial, sans-serif">3</text>
    </BaseIcon>
  );
}

export function OrganizePdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="6.5" y="7" width="7" height="8" rx="1.8" fill="currentColor" fillOpacity="0.08" />
      <rect x="18.5" y="7" width="7" height="8" rx="1.8" fill="currentColor" fillOpacity="0.12" />
      <rect x="6.5" y="17" width="7" height="8" rx="1.8" fill="currentColor" fillOpacity="0.12" />
      <rect x="18.5" y="17" width="7" height="8" rx="1.8" fill="currentColor" fillOpacity="0.08" />
      <path d="M14.5 11h3" />
      <path d="m16.4 9.2 1.8 1.8-1.8 1.8" />
      <path d="M17.5 21h-3" />
      <path d="m15.6 19.2-1.8 1.8 1.8 1.8" />
    </BaseIcon>
  );
}

export function ExtractPagesIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={7.4} y={6.4} w={12.4} h={17} fillOpacity={0.06} />
      <Doc x={10.2} y={4.5} w={12.4} h={17} fillOpacity={0.1} />
      <Doc x={18.4} y={10.2} w={8.5} h={11.8} fillOpacity={0.12} />
      <path d="M17.2 15.8h4.5" />
      <path d="m20 13.6 2.3 2.2-2.3 2.2" />
    </BaseIcon>
  );
}

export function ProtectPdfIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={7.2} y={4.9} w={13.8} h={19.7} fillOpacity={0.08} />
      <path d="M21.1 14.7c2 0 3.8-.6 5.2-1.7 0 5.2-1.8 8.3-5.2 10.2-3.5-1.9-5.3-5-5.3-10.2 1.4 1.1 3.2 1.7 5.3 1.7Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M21.1 16.8v4.3" />
      <path d="M19.1 18.9h4" />
    </BaseIcon>
  );
}

export function LocalProcessingIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="5.5" y="7" width="21" height="14" rx="3.5" fill="currentColor" fillOpacity="0.08" />
      <path d="M11 24.7h10" />
      <path d="M14.4 21v3.7" />
      <path d="M17.6 21v3.7" />
      <path d="M11 12h4.8" />
      <path d="M9.5 15.2h3.3" />
      <rect x="18" y="10.8" width="5.7" height="5.7" rx="1.6" fill="currentColor" fillOpacity="0.12" />
      <path d="M20.9 9.1v1.2" />
      <path d="M20.9 17.3v1.2" />
      <path d="M24.2 13.7h1.2" />
      <path d="M16.5 13.7h1.2" />
    </BaseIcon>
  );
}

export function NoStorageIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={5.8} y={4.8} w={11.6} h={16.8} fillOpacity={0.08} />
      <ellipse cx="22.7" cy="11.5" rx="4" ry="1.9" fill="currentColor" fillOpacity="0.08" />
      <path d="M18.7 11.5v7.2c0 1.1 1.8 1.9 4 1.9s4-.8 4-1.9v-7.2" />
      <path d="M18.7 15.2c0 1.1 1.8 1.9 4 1.9s4-.8 4-1.9" />
      <path d="M7 24.5 26 6.5" />
    </BaseIcon>
  );
}

export function NoAccountIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="13" cy="12" r="4.2" fill="currentColor" fillOpacity="0.08" />
      <path d="M6.8 23c1.2-3.4 3.6-5.1 6.2-5.1s5 1.7 6.2 5.1" />
      <circle cx="23.3" cy="20.5" r="3.5" fill="currentColor" fillOpacity="0.12" />
      <path d="m21.7 20.4 1.1 1.2 2-2.3" />
    </BaseIcon>
  );
}

export function FastIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={6.8} y={5.2} w={12.7} h={18.8} fillOpacity={0.08} />
      <path d="M5.2 12.2h4" />
      <path d="M4.4 15.8h3.5" />
      <path d="M5.6 19.4h4.1" />
      <path d="m19.4 12.1 3.4.2-1.8 4.1h3.3l-5 7.4 1.2-5h-3.2Z" fill="currentColor" fillOpacity="0.12" />
    </BaseIcon>
  );
}

export function PrivateIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={6.8} y={4.9} w={12.9} h={19.4} fillOpacity={0.08} />
      <path d="M22.3 14.8c1.8 0 3.4-.5 4.7-1.5 0 4.8-1.6 7.6-4.7 9.3-3.1-1.7-4.8-4.5-4.8-9.3 1.3 1 2.9 1.5 4.8 1.5Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M22.3 17.2v3.8" />
      <path d="M20.5 19.1h3.6" />
    </BaseIcon>
  );
}

export function SimpleIcon(props: KagojIconProps) {
  return (
    <BaseIcon {...props}>
      <Doc x={7.2} y={5.1} w={13.4} h={18.8} fillOpacity={0.08} />
      <path d="M12 13.2h5.8" />
      <path d="M12 17h8.2" />
      <path d="M22.7 8.8 24 11.3l2.7 1.3-2.7 1.2-1.3 2.6-1.3-2.6-2.7-1.2 2.7-1.3Z" fill="currentColor" fillOpacity="0.12" />
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
