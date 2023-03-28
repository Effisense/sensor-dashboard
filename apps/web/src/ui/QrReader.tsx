import {
  QrReader as _QrReader,
  QrReaderProps as _QrReaderProps,
} from "react-qr-reader";
import { slate } from "tailwindcss/colors";

type QrReaderProps = Omit<_QrReaderProps, "constraints">;

const QrReader = ({ onResult, ...props }: QrReaderProps) => {
  return (
    <_QrReader
      {...props}
      onResult={onResult}
      constraints={{
        facingMode: "environment",
      }}
      videoStyle={{
        height: "auto",
        width: "100%",
        borderRadius: "0.25rem",
        borderWidth: "2px",
        borderColor: slate["800"],
      }}
    />
  );
};

export default QrReader;
