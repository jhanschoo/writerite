import { Span } from "../basic/Span";

interface Props {
	full?: boolean;
	prefix?: string;
	suffix?: string;
}

const BrandText: React.FC<Props> = ({ prefix, full, suffix }) =>
	(
		<Span sx={{
			fontWeight: 400,
			fontSize: "125%",
			fontFamily: "Yeseva One, serif",
		}}>
			{prefix}{full ? "WriteRite" : "Wr"}{suffix}
		</Span>
	);

export default BrandText;
